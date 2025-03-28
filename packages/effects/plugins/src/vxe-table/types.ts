import type {
  VxeGridListeners,
  VxeGridPropTypes,
  VxeGridProps as VxeTableGridProps,
  VxeUIExport,
} from 'vxe-table';

import type { Ref, VNode } from 'vue';

import type { ClassType, DeepPartial } from '@vben/types';

import type { VbenFormProps } from '@vben-core/form-ui';

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

export interface VxeTableGridOptions<T = any> extends VxeTableGridProps<T> {
  /** 工具栏配置 */
  toolbarConfig?: ToolbarConfigOptions;
}

export interface VxeGridProps {
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
  gridOptions?: DeepPartial<VxeTableGridOptions>;
  /**
   * vxe-grid 事件
   */
  gridEvents?: DeepPartial<VxeGridListeners>;
  /**
   * 表单配置
   */
  formOptions?: VbenFormProps;
  /**
   * 显示搜索表单
   */
  showSearchForm?: boolean;
}

export interface VxeCustomSlots {
  /**
   * 自定义全局的加载中状态
   */
  loadingRender?: (params: any) => string | VNode;
  /**
   * 自定义全局的分割线
   */
  dividerRender?: (params: any) => string | VNode;
  /**
   * 自定义空状态
   */
  emptyRender?: (params: any) => string | VNode;
  /**
   * 自定义分页器
   */
  pagerRender?: (params: any) => VNode;
  /**
   * 自定义左侧工具栏
   */
  leftToolbarRender?: (params: any) => VNode;
  /**
   * 自定义右侧工具栏
   */
  rightToolbarRender?: (params: any) => VNode;
}

export type ExtendedVxeGridApi = VxeGridApi & {
  useStore: <T = NoInfer<VxeGridProps>>(
    selector?: (state: NoInfer<VxeGridProps>) => T,
  ) => Readonly<Ref<T>>;
};

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm: typeof useVbenForm;
  customSlots?: VxeCustomSlots;
}
