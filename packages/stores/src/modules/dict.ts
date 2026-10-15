import { ref } from 'vue';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface DictItem {
  [key: string]: any;
  /** Tag 颜色，CellDict 使用 */
  color?: string;
  label: string;
  value: number | string;
}

interface DictHandler {
  getAllDicts?: () => Promise<Record<string, DictItem[]>>;
  getDict?: (code: string) => Promise<DictItem[]>;
  getVersion?: () => Promise<number | string | undefined>;
}

/**
 * 自定义字典处理模块
 * Custom dictionary handler module
 */
let customDictHandler: null | Partial<DictHandler> = null;

/**
 * 注入自定义字典处理器
 * Inject a custom dictionary handler
 */
const setDictHandler = (handler: Partial<DictHandler>) => {
  customDictHandler = handler;
};

/**
 * 获取字典处理模块
 * Get the dictionary handler
 */
const getDictHandler = (): Partial<DictHandler> => {
  return customDictHandler ?? {};
};

/**
 * 正在进行的按编码请求，用于合并并发
 * In-flight requests keyed by dict code for request dedupe
 */
const pendingRequests = new Map<string, Promise<DictItem[]>>();

/**
 * 字典支持模块
 * Dictionary support module
 */
const useDictStore = defineStore(
  'core-dict',
  () => {
    const dictMap = ref<Record<string, DictItem[]>>({});
    const version = ref<number | string | undefined>();
    /**
     * 批次号：`$reset` 或全量 `refreshDict()` 时递增，用于丢弃之前发出的 `loadAllDicts` 结果
     * Batch token: bumped on `$reset` or full `refreshDict()` so earlier `loadAllDicts` responses are discarded
     */
    let batchToken = 0;

    /**
     * 按编码异步获取字典项（带缓存与并发合并）
     * Get dict items by code asynchronously (with cache and request dedupe)
     * @param code 字典编码
     */
    async function getDict(code: string): Promise<DictItem[]> {
      const cached = dictMap.value[code];
      if (cached) {
        return cached;
      }

      const handler = getDictHandler();
      if (!handler.getDict) {
        return [];
      }

      const pending = pendingRequests.get(code);
      if (pending) {
        return pending;
      }

      // refreshDict / $reset 会移除登记，只有仍登记为当前请求时才写入或清理
      const request: Promise<DictItem[]> = handler
        .getDict(code)
        .then((items) => {
          if (pendingRequests.get(code) === request) {
            dictMap.value = { ...dictMap.value, [code]: items };
          }
          return items;
        })
        .finally(() => {
          if (pendingRequests.get(code) === request) {
            pendingRequests.delete(code);
          }
        });

      pendingRequests.set(code, request);
      return request;
    }

    /**
     * 同步读取字典项（响应式）；未命中时后台触发加载
     * Synchronously read dict items (reactive); triggers background load on miss
     * @param code 字典编码
     */
    function getDictSync(code: string): DictItem[] {
      const cached = dictMap.value[code];
      if (cached) {
        return cached;
      }
      if (getDictHandler().getDict) {
        getDict(code).catch(() => {
          // 后台加载失败时静默忽略
        });
      }
      return [];
    }

    /**
     * 按编码与值查找字典项
     * Find a dict item by code and value
     * @param code 字典编码
     * @param value 字典值
     */
    function getDictItem(
      code: string,
      value: null | number | string | undefined,
    ): DictItem | undefined {
      if (value === null || value === undefined) {
        return undefined;
      }
      const items = getDictSync(code);
      return items.find((item) => String(item.value) === String(value));
    }

    /**
     * 按编码与值获取字典标签；找不到时返回原值
     * Get dict label by code and value; returns the original value when not found
     * @param code 字典编码
     * @param value 字典值
     */
    function getDictLabel(
      code: string,
      value: null | number | string | undefined,
    ): null | number | string | undefined {
      const item = getDictItem(code, value);
      return item?.label ?? value;
    }

    /**
     * 全量预加载字典（支持版本校验）
     * Preload all dictionaries (with version check)
     * @param force 是否强制刷新
     */
    async function loadAllDicts(force = false): Promise<void> {
      const handler = getDictHandler();
      if (!handler.getAllDicts) {
        return;
      }

      const token = batchToken;
      let remoteVersion: number | string | undefined;

      if (handler.getVersion) {
        remoteVersion = await handler.getVersion();
        if (token !== batchToken) {
          return;
        }
        if (
          !force &&
          remoteVersion !== undefined &&
          remoteVersion === version.value &&
          Object.keys(dictMap.value).length > 0
        ) {
          return;
        }
      } else if (!force && Object.keys(dictMap.value).length > 0) {
        return;
      }

      const all = await handler.getAllDicts();
      if (token !== batchToken) {
        return;
      }
      dictMap.value = all ?? {};
      if (remoteVersion !== undefined) {
        version.value = remoteVersion;
      }
    }

    /**
     * 刷新字典缓存
     * Refresh dictionary cache
     * @param code 可选；传入时只清除该编码，否则清除全部
     */
    function refreshDict(code?: string) {
      if (code) {
        const { [code]: _removed, ...rest } = dictMap.value;
        dictMap.value = rest;
        pendingRequests.delete(code);
      } else {
        batchToken += 1;
        dictMap.value = {};
        version.value = undefined;
        pendingRequests.clear();
      }
    }

    function $reset() {
      batchToken += 1;
      dictMap.value = {};
      version.value = undefined;
      pendingRequests.clear();
    }

    return {
      dictMap,
      version,
      getDict,
      getDictSync,
      getDictItem,
      getDictLabel,
      loadAllDicts,
      refreshDict,
      $reset,
    };
  },
  {
    persist: {
      // 持久化
      pick: ['dictMap', 'version'],
    },
  },
);

export type { DictHandler, DictItem };
export { setDictHandler, useDictStore };

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useDictStore, hot));
}
