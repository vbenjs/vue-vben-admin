import type { DrawerApi } from './drawer-api';

import type { Component, Ref } from 'vue';

export interface DrawerProps {
  /**
   * 取消按钮文字
   */
  cancelText?: string;

  /**
   * 是否显示右上角的关闭按钮
   * @default true
   */
  closable?: boolean;
  /**
   * 确定按钮 loading
   * @default false
   */
  confirmLoading?: boolean;
  /**
   * 确定按钮文字
   */
  confirmText?: string;
  /**
   * 弹窗描述
   */
  description?: string;
  /**
   * 是否显示底部
   * @default true
   */
  footer?: boolean;
  /**
   * 弹窗是否显示
   * @default false
   */
  loading?: boolean;
  /**
   * 是否显示遮罩
   * @default true
   */
  modal?: boolean;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 弹窗标题提示
   */
  titleTooltip?: string;
}

export interface DrawerState extends DrawerProps {
  /** 弹窗打开状态 */
  isOpen?: boolean;
  /**
   * 共享数据
   */
  sharedData?: Record<string, any>;
}

export type ExtendedDrawerApi = {
  useStore: <T = NoInfer<DrawerState>>(
    selector?: (state: NoInfer<DrawerState>) => T,
  ) => Readonly<Ref<T>>;
} & DrawerApi;

export interface DrawerApiOptions extends DrawerState {
  connectedComponent?: Component;
  onBeforeClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}
