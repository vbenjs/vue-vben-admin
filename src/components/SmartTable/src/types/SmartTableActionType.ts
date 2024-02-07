import type { ButtonProps } from '@/components/Button';
import type { TooltipProps } from 'ant-design-vue';
import type { SmartAuth } from '#/utils';

export interface ActionItem extends ButtonProps {
  onClick?: Fn;
  label?: string;
  danger?: boolean;
  // color?: 'success' | 'error' | 'warning';
  icon?: string;
  popConfirm?: PopConfirm;
  disabled?: boolean;
  divider?: boolean;
  // 权限编码控制是否显示
  auth?: SmartAuth | string;
  // 业务控制是否显示
  ifShow?: boolean | ((action: ActionItem) => boolean);
  tooltip?: string | TooltipProps;
  // 自定义类名
  class?: string | Record<string, boolean> | any[];
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: Fn;
  cancel?: Fn;
  icon?: string;
  placement?: string;
}
