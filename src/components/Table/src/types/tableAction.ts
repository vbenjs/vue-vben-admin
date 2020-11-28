import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';
export interface ActionItem extends ButtonProps {
  onClick?: any;
  label: string;
  color?: 'success' | 'error' | 'warning';
  icon?: string;
  popConfirm?: PopConfirm;
}

export interface PopConfirm {
  title: string;
  okText?: string;
  cancelText?: string;
  confirm: any;
  cancel?: any;
  icon?: string;
}
