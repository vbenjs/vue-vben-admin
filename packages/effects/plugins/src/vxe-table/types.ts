import type { DeepPartial } from '@vben/types';
import type { VbenFormProps } from '@vben-core/form-ui';
import type { VbenPaginationProps } from '@vben-core/shadcn-ui';
import type {
  VxeGridListeners,
  VxeGridProps as VxeTableGridProps,
  VxeUIExport,
} from 'vxe-table';

import type { VxeGridApi } from './api';

import type { Ref } from 'vue';

import { useVbenForm } from '@vben-core/form-ui';

export interface VxePaginationInfo {
  currentPage: number;
  pageSize: number;
  total: number;
}

export interface VxeGridProps {
  /**
   * 组件class
   */
  class?: any;
  /**
   * vxe-grid class
   */
  gridClass?: any;
  /**
   * vxe-grid 配置
   */
  gridOptions?: DeepPartial<VxeTableGridProps>;
  gridEvents?: DeepPartial<VxeGridListeners>;
  /**
   * 表单配置
   */
  formOptions?: VbenFormProps;
  /**
   * 分页样式
   */
  paginationClass?: any;
  /**
   * 分页配置
   */
  paginationOptions?: VbenPaginationProps;
  /**
   * 分页信息
   */
  paginationInfo?: Partial<VxePaginationInfo>;
}

export type ExtendedVxeGridApi = {
  useStore: <T = NoInfer<VxeGridProps>>(
    selector?: (state: NoInfer<VxeGridProps>) => T,
  ) => Readonly<Ref<T>>;
} & VxeGridApi;

export interface SetupVxeTable {
  configVxeTable: (ui: VxeUIExport) => void;
  useVbenForm: typeof useVbenForm;
}
