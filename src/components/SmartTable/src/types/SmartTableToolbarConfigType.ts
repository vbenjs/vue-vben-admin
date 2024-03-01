import type { VxeButtonProps } from 'vxe-table';

/**
 * toolbar column config
 */
export interface SmartTableToolbarColumnConfig {
  trigger?: 'manual' | 'click' | 'hover';
  buttonProps?: VxeButtonProps;
  // 是否支持列排序
  columnOrder?: boolean;
}

export interface SmartTableToolbarSizeSetting {
  // nothing
  buttonProps?: VxeButtonProps;
}
