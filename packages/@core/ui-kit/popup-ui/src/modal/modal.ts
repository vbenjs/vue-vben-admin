import type { ModalApi } from './modal-api';

import type { Component, Ref } from 'vue';

export interface ModalProps {
  /**
   * 取消按钮文字
   */
  cancelText?: string;
  /**
   * 是否居中
   * @default false
   */
  centered?: boolean;
  /**
   * 是否显示右上角的关闭按钮
   * @default true
   */
  closable?: boolean;
  /**
   * 点击弹窗遮罩是否关闭弹窗
   * @default true
   */
  closeOnClickModal?: boolean;
  /**
   * 按下 ESC 键是否关闭弹窗
   * @default true
   */
  closeOnPressEscape?: boolean;
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
   * 是否可拖拽
   * @default false
   */
  draggable?: boolean;
  /**
   * 是否显示底部
   * @default true
   */
  footer?: boolean;
  /**
   * 是否全屏
   * @default false
   */
  fullscreen?: boolean;
  /**
   * 是否显示全屏按钮
   * @default true
   */
  fullscreenButton?: boolean;
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

export interface ModalState extends ModalProps {
  /** 弹窗打开状态 */
  isOpen?: boolean;
  /**
   * 共享数据
   */
  sharedData?: Record<string, any>;
}

export type ExtendedModalApi = {
  useStore: <T = NoInfer<ModalState>>(
    selector?: (state: NoInfer<ModalState>) => T,
  ) => Readonly<Ref<T>>;
} & ModalApi;

export interface ModalApiOptions extends ModalState {
  connectedComponent?: Component;
  onBeforeClose?: () => void;
  onCancel?: () => void;
  onConfirm?: () => void;
  onOpenChange?: (isOpen: boolean) => void;
}
