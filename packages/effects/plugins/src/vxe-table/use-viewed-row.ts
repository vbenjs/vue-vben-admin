/* eslint-disable unicorn/no-nested-ternary */
import type { VxeGridProps as VxeTableGridProps } from 'vxe-table';

import type {
  ViewedRowOptions,
  ViewedRowPersistOptions,
  ViewedRowStorageAdapter,
} from './types';

import { isRef, shallowRef, toRaw, triggerRef, watch } from 'vue';

import { isBoolean, isFunction } from '@vben/utils';

import {
  IndexedDBDriver,
  LocalStorageDriver,
  StorageManager,
} from '@vben-core/shared/cache';

import { useDebounceFn } from '@vueuse/core';

const DEFAULT_VIEWED_CLASS = 'vxe-row--viewed';

// ========== 持久化策略 ==========

/**
 * localStorage / sessionStorage 适配器
 * 整体存储：key → [1, 2, 3]
 */
function createWebStorageAdapter(
  storageType: 'localStorage' | 'sessionStorage',
  key: string,
  ttl?: number,
): ViewedRowStorageAdapter {
  const manager = new StorageManager({
    driver: new LocalStorageDriver({ storageType }),
  });

  return {
    async getKeys() {
      const stored = await manager.getItem<Array<number | string>>(key);
      return stored ?? [];
    },
    async removeKeys() {
      await manager.removeItem(key);
    },
    async setKeys(keys) {
      await manager.setItem(key, keys, ttl);
    },
  };
}

/**
 * IndexedDB 适配器
 * 单条存储：prefix:1 → { expiry, value: 1 }
 */
function createIndexedDBAdapter(
  opts: Extract<ViewedRowPersistOptions, { type: 'indexedDB' }>,
): ViewedRowStorageAdapter {
  const prefix = opts.key;
  const manager = new StorageManager({
    driver: new IndexedDBDriver({
      dbName: opts.dbName || 'viewed-table-db',
      dbVersion: opts.dbVersion || 1,
      storeName: opts.storeName || 'viewed-table-row',
    }),
    prefix,
  });

  return {
    async getKeys() {
      try {
        // 通过 StorageManager 获取当前前缀下所有 key，再逐条读取（自动过滤过期）
        const shortKeys = await manager.keys();

        const results: Array<number | string> = [];
        for (const shortKey of shortKeys) {
          const value = await manager.getItem<number | string>(shortKey);
          if (value !== null) {
            results.push(value);
          }
        }
        return results;
      } catch (error) {
        console.error('[viewedRow] indexedDB restore failed:', error);
        return [];
      }
    },
    async removeKeys() {
      try {
        await manager.clear();
      } catch (error) {
        console.error('[viewedRow] indexedDB clear failed:', error);
      }
    },
    async setKeys(keys) {
      try {
        const newKeySet = new Set(keys.map(String));
        // 获取已存在的 key，避免重复写入刷新过期时间
        const existingKeys = await manager.keys();
        const existingKeySet = new Set(existingKeys);

        // 只写入新增的 key，不覆盖已有记录的过期时间
        const toAdd = keys.filter((key) => !existingKeySet.has(String(key)));
        if (toAdd.length > 0) {
          await Promise.all(
            toAdd.map((key) => manager.setItem(String(key), key, opts.ttl)),
          );
        }

        // 清理不在新集合中的旧 key
        const toRemove = existingKeys.filter((k) => !newKeySet.has(k));
        if (toRemove.length > 0) {
          await Promise.all(toRemove.map((k) => manager.removeItem(k)));
        }
      } catch (error) {
        console.error('[viewedRow] indexedDB persist failed:', error);
      }
    },
  };
}

/**
 * 根据 persist 配置创建存储适配器
 */
function createStorageAdapter(
  persist?: string | ViewedRowPersistOptions,
): null | ViewedRowStorageAdapter {
  if (!persist) return null;

  // 简写模式：string → localStorage
  if (typeof persist === 'string') {
    return createWebStorageAdapter('localStorage', persist);
  }

  switch (persist.type) {
    case 'custom': {
      // 用户自定义适配器，解除 Vue 响应式代理
      return toRaw(persist.storage);
    }
    case 'indexedDB': {
      return createIndexedDBAdapter(persist);
    }
    case 'localStorage': {
      return createWebStorageAdapter('localStorage', persist.key, persist.ttl);
    }
    case 'memory': {
      return null;
    }
    case 'sessionStorage': {
      return createWebStorageAdapter(
        'sessionStorage',
        persist.key,
        persist.ttl,
      );
    }
    default: {
      return null;
    }
  }
}

// ========== maxSize 淘汰 ==========

/**
 * 强制执行 maxSize 限制，超出时淘汰最早插入的 key（FIFO）
 */
function enforceMaxSize(set: Set<number | string>, maxSize: number): void {
  if (maxSize > 0 && set.size > maxSize) {
    const iterator = set.values();
    while (set.size > maxSize) {
      const oldest = iterator.next().value;
      if (oldest !== undefined) {
        set.delete(oldest);
      }
    }
  }
}

// ========== 核心 composable ==========

export function useViewedRow<T = any>(
  options: ViewedRowOptions<T> & { keyField: string },
) {
  // ========== 解析持久化配置 ==========
  const persistOpts: null | ViewedRowPersistOptions = options.persist
    ? typeof options.persist === 'string'
      ? { key: options.persist, type: 'localStorage' }
      : options.persist
    : null;

  const adapter = createStorageAdapter(options.persist);
  const maxSize = persistOpts?.maxSize ?? 100;

  // ========== 初始化已读集合 ==========
  const viewedSet = shallowRef<Set<number | string>>(new Set());

  // ========== 持久化（防抖） ==========
  function persistImmediate() {
    if (!adapter) return;
    adapter.setKeys([...viewedSet.value]).catch((error) => {
      console.error('[viewedRow] persist failed:', error);
    });
  }

  const persist = useDebounceFn(persistImmediate, 300);

  // ========== 从存储恢复 ==========
  async function restoreFromStorage(): Promise<void> {
    if (!adapter) return;

    try {
      const stored = await adapter.getKeys();
      if (stored && stored.length > 0) {
        for (const key of stored) {
          viewedSet.value.add(key);
        }
        if (maxSize > 0) {
          enforceMaxSize(viewedSet.value, maxSize);
        }
        triggerRef(viewedSet);
      }
    } catch (error) {
      console.error('[viewedRow] restore failed:', error);
    }
  }

  // 先恢复存储，再合并外部 viewedKeys，确保 viewedKeys 是最新插入的（最后被淘汰）
  restoreFromStorage().then(() => {
    if (options.viewedKeys) {
      const keys = isRef(options.viewedKeys)
        ? options.viewedKeys.value
        : options.viewedKeys;
      updateViewedSet((set) => {
        let changed = false;
        for (const key of keys) {
          if (!set.has(key)) {
            set.add(key);
            changed = true;
          }
        }
        return changed;
      });
    }
  });

  // ========== 更新 viewedSet 的统一入口 ==========
  function updateViewedSet(updater: (set: Set<number | string>) => boolean) {
    const changed = updater(viewedSet.value);

    if (changed) {
      if (maxSize > 0) {
        enforceMaxSize(viewedSet.value, maxSize);
      }
      triggerRef(viewedSet);
      persist();
    }
  }

  // ========== 监听外部 viewedKeys 变化（如果是 Ref） ==========
  if (isRef(options.viewedKeys)) {
    watch(options.viewedKeys, (newKeys) => {
      updateViewedSet((set) => {
        let changed = false;
        for (const key of newKeys) {
          if (!set.has(key)) {
            set.add(key);
            changed = true;
          }
        }
        return changed;
      });
    });
  }

  // ========== 标记已读 ==========
  function markAsViewed(record: T) {
    const key = (record as Record<string, any>)[options.keyField] as
      | number
      | string;
    if (key === null || key === undefined) return;

    updateViewedSet((set) => {
      if (set.has(key)) return false;
      set.add(key);
      return true;
    });
  }

  function markKeysAsViewed(keys: Array<number | string>) {
    updateViewedSet((set) => {
      let changed = false;
      for (const key of keys) {
        if (!set.has(key)) {
          set.add(key);
          changed = true;
        }
      }
      return changed;
    });
  }

  // ========== 查询 ==========
  function isViewed(record: T): boolean {
    const key = (record as Record<string, any>)[options.keyField] as
      | number
      | string;
    return viewedSet.value.has(key);
  }

  // ========== 清除 ==========
  function clearViewed() {
    const hadData = viewedSet.value.size > 0;
    viewedSet.value.clear();

    if (hadData) {
      triggerRef(viewedSet);
    }

    if (adapter) {
      adapter.removeKeys().catch((error) => {
        console.error('[viewedRow] clear persist failed:', error);
      });
    }
  }

  // ========== 移除指定 keys ==========
  function removeKeys(keys: Array<number | string>) {
    updateViewedSet((set) => {
      let changed = false;
      for (const key of keys) {
        if (set.has(key)) {
          set.delete(key);
          changed = true;
        }
      }
      return changed;
    });
  }

  // ========== rowClassName 函数 ==========
  function getRowClassName(params: any): string {
    if (!isViewed(params.row)) return '';

    const { rowClassName } = options;
    if (rowClassName === undefined || rowClassName === null) {
      return DEFAULT_VIEWED_CLASS;
    }
    if (typeof rowClassName === 'string') {
      return rowClassName;
    }
    if (isFunction(rowClassName)) {
      return normalizeClassName(rowClassName(params));
    }
    return DEFAULT_VIEWED_CLASS;
  }

  // ========== rowStyle 函数 ==========
  function getRowStyle(params: any): any {
    if (!isViewed(params.row)) return undefined;

    const { rowStyle } = options;
    if (rowStyle === undefined || rowStyle === null) {
      return undefined;
    }
    if (isFunction(rowStyle)) {
      return rowStyle(params);
    }
    return rowStyle;
  }

  return {
    clearViewed,
    getRowClassName,
    getRowStyle,
    isViewed,
    markAsViewed,
    markKeysAsViewed,
    removeKeys,
    viewedSet,
  };
}

export type ViewedRowHelper<T = any> = ReturnType<typeof useViewedRow<T>>;

// ========== 工具函数 ==========

function normalizeClassName(value: any): string {
  if (!value) return '';
  if (typeof value === 'string') return value;
  if (typeof value === 'object') {
    return Object.entries(value)
      .filter(([, v]) => v)
      .map(([k]) => k)
      .join(' ');
  }
  return '';
}

function mergeClassNames(...classNames: any[]): string {
  return classNames
    .map((c) => normalizeClassName(c))
    .filter(Boolean)
    .join(' ');
}

/**
 * 包装 columns，拦截 CellOperation 的 onClick，根据 actionCodes 自动标记已读
 * 注意：columns 每次都是 cloneDeep 后的新对象，不存在重复包装问题
 */
function wrapColumnsForViewedRow(
  columns: any[],
  actionCodes: string[],
  markAsViewed: (record: any) => void,
): any[] {
  return columns.map((column) => {
    if (!column || typeof column !== 'object') return column;

    const nextColumn = { ...column };

    if (nextColumn.cellRender?.name === 'CellOperation') {
      const cellRender = { ...nextColumn.cellRender };
      const attrs = { ...cellRender.attrs };
      const originalOnClick = attrs.onClick;

      attrs.onClick = (params: { code: string; row: any }) => {
        originalOnClick?.(params);
        if (actionCodes.includes(params.code)) {
          markAsViewed(params.row);
        }
      };

      cellRender.attrs = attrs;
      nextColumn.cellRender = cellRender;
    }

    if (Array.isArray(nextColumn.children)) {
      nextColumn.children = wrapColumnsForViewedRow(
        nextColumn.children,
        actionCodes,
        markAsViewed,
      );
    }

    return nextColumn;
  });
}

/**
 * 将 viewedRow 配置应用到 mergedOptions 上
 * 注入 rowClassName、rowStyle、columns 拦截
 */
export function applyViewedRowOptions(
  mergedOptions: VxeTableGridProps,
  viewedRowConfig: boolean | ViewedRowOptions,
  helper: ReturnType<typeof useViewedRow>,
) {
  // 从最新的配置中读取 rowClassName 和 rowStyle（支持运行时修改）
  const viewedRowClassName = isBoolean(viewedRowConfig)
    ? undefined
    : viewedRowConfig.rowClassName;
  const viewedRowStyle = isBoolean(viewedRowConfig)
    ? undefined
    : viewedRowConfig.rowStyle;

  // 注入 rowClassName
  const originalRowClassName = mergedOptions.rowClassName;
  mergedOptions.rowClassName = (params: any) => {
    if (!helper.isViewed(params.row)) {
      return normalizeClassName(
        isFunction(originalRowClassName)
          ? originalRowClassName(params)
          : originalRowClassName,
      );
    }

    let viewedClass: string;
    if (viewedRowClassName === undefined || viewedRowClassName === null) {
      viewedClass = DEFAULT_VIEWED_CLASS;
    } else if (typeof viewedRowClassName === 'string') {
      viewedClass = viewedRowClassName;
    } else if (isFunction(viewedRowClassName)) {
      viewedClass = normalizeClassName(viewedRowClassName(params));
    } else {
      viewedClass = DEFAULT_VIEWED_CLASS;
    }

    return mergeClassNames(
      isFunction(originalRowClassName)
        ? originalRowClassName(params)
        : originalRowClassName,
      viewedClass,
    );
  };

  // 注入 rowStyle
  const originalRowStyle = mergedOptions.rowStyle;
  mergedOptions.rowStyle = (params: any) => {
    const originalStyle = isFunction(originalRowStyle)
      ? originalRowStyle(params)
      : originalRowStyle;

    if (!helper.isViewed(params.row)) {
      return originalStyle || undefined;
    }

    let viewedStyle: any;
    if (viewedRowStyle === undefined || viewedRowStyle === null) {
      viewedStyle = undefined;
    } else if (isFunction(viewedRowStyle)) {
      viewedStyle = viewedRowStyle(params);
    } else {
      viewedStyle = viewedRowStyle;
    }

    if (!viewedStyle && !originalStyle) return undefined;
    if (!originalStyle) return viewedStyle;
    if (!viewedStyle) return originalStyle;
    return { ...originalStyle, ...viewedStyle };
  };

  // 拦截 CellOperation columns
  const actionCodes =
    !isBoolean(viewedRowConfig) && viewedRowConfig.actionCodes
      ? Array.isArray(viewedRowConfig.actionCodes)
        ? viewedRowConfig.actionCodes
        : [viewedRowConfig.actionCodes]
      : [];

  if (actionCodes.length > 0 && Array.isArray(mergedOptions.columns)) {
    mergedOptions.columns = wrapColumnsForViewedRow(
      mergedOptions.columns,
      actionCodes,
      helper.markAsViewed,
    );
  }
}
