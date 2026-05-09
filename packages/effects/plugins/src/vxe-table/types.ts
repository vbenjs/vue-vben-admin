import type {
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeTablePropTypes,
  VxeUIExport,
} from 'vxe-table';

import type { Ref } from 'vue';

import type { ClassType, DeepPartial } from '@vben/types';

import type { BaseFormComponentType, VbenFormProps } from '@vben-core/form-ui';

import type { VxeGridApi } from './api';

import { useVbenForm } from '@vben-core/form-ui';

export interface VxePaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

interface ToolbarConfigOptions extends VxeGridPropTypes.ToolbarConfig {
  /** 是否显示切换搜索表单的按钮 */
  search?: boolean;
}

export type VxeTableGridColumns<T = any> = VxeTableGridOptions<T>['columns'];

export interface VxeTableGridOptions<T = any> extends VxeTableGridProps<T> {
  /** 工具栏配置 */
  toolbarConfig?: ToolbarConfigOptions;
}

export interface SeparatorOptions {
  show?: boolean;
  backgroundColor?: string;
}

/**
 * 自定义存储适配器接口
 * 用户可接入任意后端（API、IndexedDB wrapper、第三方库等）
 */
export interface ViewedRowStorageAdapter {
  /** 读取所有已查看的 key 列表 */
  getKeys(): Promise<Array<number | string>>;

  /** 移除所有已查看数据 */
  removeKeys(): Promise<void>;

  /** 持久化已查看的 key 列表 */
  setKeys(keys: Array<number | string>): Promise<void>;
}

/**
 * 已读行持久化 — 公共基础字段
 */
interface ViewedRowPersistBase {
  /** 持久化数据的存活时间（毫秒） */
  ttl?: number;
  /** 最大缓存数量，超出时淘汰最早标记的 key（FIFO），默认 100 */
  maxSize?: number;
}

/**
 * 已读行持久化配置（按 type 区分的联合类型）
 *
 * - 'memory'          → 仅内存，不持久化
 * - 'localStorage'    → 使用 localStorage 整体存储，key 必传
 * - 'sessionStorage'  → 使用 sessionStorage 整体存储，key 必传
 * - 'indexedDB'       → 使用 IndexedDB 单条存储，key 必传
 * - 'custom'          → 用户自定义存储适配器，storage 必传
 */
export type ViewedRowPersistOptions =
  | ({
  /** IndexedDB 数据库名称，默认 'viewed-table-db' */
  dbName?: string;
  /** IndexedDB 数据库版本，默认 1 */
  dbVersion?: number;
  /** 存储 key / prefix（必传） */
  key: string;
  /** IndexedDB 对象存储名称，默认 'viewed-table-row' */
  storeName?: string;
  type: 'indexedDB';
} & ViewedRowPersistBase)
  | ({
  /** 存储 key（必传） */
  key: string;
  type: 'localStorage' | 'sessionStorage';
} & ViewedRowPersistBase)
  | ({
  /** 自定义存储适配器（必传） */
  storage: ViewedRowStorageAdapter;
  type: 'custom';
} & ViewedRowPersistBase)
  | (ViewedRowPersistBase & {
  type: 'memory';
});

/**
 * 已查看row设置
 */
export interface ViewedRowOptions<T = any> {
  /** 点击 CellOperation 中匹配的 code 时，自动将该行标记为已读 */
  actionCodes?: string | string[];
  /** 行唯一标识字段，默认取 gridOptions.rowConfig.keyField，最终兜底 'id' */
  keyField?: string;
  /** 已查看的行key列表 */
  viewedKeys?: Array<number | string> | Ref<Array<number | string>>;
  /**
   * 持久化配置
   * - 传 string：使用内置 localStorage，值为 storage key（向后兼容）
   * - 传 object：高级配置
   * - 不传：不持久化（等同于 memory）
   */
  persist?: string | ViewedRowPersistOptions;
  rowClassName?: VxeTablePropTypes.RowClassName<T>;
  rowStyle?: VxeTablePropTypes.RowStyle<T>;
}

export interface VxeGridProps<
  T extends Record<string, any> = any,
  D extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
> {
  /**
   * 数据
   */
  tableData?: any[];
  /**
   * 标题
   */
  tableTitle?: string;
  /**
   * 标题帮助
   */
  tableTitleHelp?: string;
  /**
   * 组件class
   */
  class?: ClassType;
  /**
   * vxe-grid class
   */
  gridClass?: ClassType;
  /**
   * vxe-grid 配置
   */
  gridOptions?: DeepPartial<VxeTableGridOptions<T>>;
  /**
   * vxe-grid 事件
   */
  gridEvents?: DeepPartial<VxeGridListeners<T>>;
  /**
   * 表单配置
   */
  formOptions?: VbenFormProps<D, P>;
  /**
   * 显示搜索表单
   */
  showSearchForm?: boolean;
  /**
   * 搜索表单与表格主体之间的分隔条
   */
  separator?: boolean | SeparatorOptions;
  /**
   * 已读行功能
   */
  viewedRowOptions?: boolean | ViewedRowOptions<T>;
}

export type ExtendedVxeGridApi<
  D extends Record<string, any> = any,
  F extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
> = VxeGridApi<D, F, P> & {
  useStore: <S = NoInfer<VxeGridProps<D, F, P>>>(
    selector?: (state: NoInfer<VxeGridProps<D, F, P>>) => S,
  ) => Readonly<Ref<S>>;
};

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm?: typeof useVbenForm;
}
