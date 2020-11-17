export interface ActionItem {
  onClick?: any;
  label: string;
  disabled?: boolean;
  color?: 'success' | 'error' | 'warning';
  type?: string;
  props?: any;
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
