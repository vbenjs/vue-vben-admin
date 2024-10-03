import type { DeepPartial } from '@vben/types';
import type { VbenPaginationProps } from '@vben-core/shadcn-ui';
import type { VxeGridProps as GridProps } from 'vxe-table';

import type { VxeGridApi } from './api';

import type { Ref } from 'vue';

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
  gridOptions?: DeepPartial<GridProps>;
  /**
   * 分页样式
   */
  paginationClass?: any;
  /**
   * 分页配置
   */
  paginationOptions?: VbenPaginationProps;
}

export type ExtendedVxeGridApi = {
  useStore: <T = NoInfer<VxeGridProps>>(
    selector?: (state: NoInfer<VxeGridProps>) => T,
  ) => Readonly<Ref<T>>;
} & VxeGridApi;
