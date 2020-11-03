import type { ModalFunc, ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import type { MessageApi } from 'ant-design-vue/lib/message/index';
import type { VNodeTypes, CSSProperties } from 'vue';

import { Modal, message as Message, notification } from 'ant-design-vue';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';

import { useSetting } from '/@/hooks/core/useSetting';

export interface ArgsProps {
  message: VNodeTypes;
  description?: VNodeTypes;
  btn?: VNodeTypes;
  key?: string;
  onClose?: () => void;
  duration?: number | null;
  icon?: VNodeTypes;
  placement?: NotificationPlacement;
  style?: CSSProperties;
  prefixCls?: string;
  class?: string;
  readonly type?: IconType;
  onClick?: () => void;
  top?: number;
  bottom?: number;
  getContainer?: () => HTMLElement;
  closeIcon?: VNodeTypes;
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ConfigProps {
  top?: string | number;
  bottom?: string | number;
  duration?: number;
  placement?: NotificationPlacement;
  getContainer?: () => HTMLElement;
  closeIcon?: VNodeTypes;
}

export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

interface ConfirmOptions {
  info: ModalFunc;
  success: ModalFunc;
  error: ModalFunc;
  warn: ModalFunc;
  warning: ModalFunc;
}

const { projectSetting } = useSetting();

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled class="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled class="modal-icon-success" />;
  } else if (iconType === 'info') {
    return <InfoCircleFilled class="modal-icon-info" />;
  } else {
    return <CloseCircleFilled class="modal-icon-error" />;
  }
}
function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  return <div innerHTML={`<div>${content as string}</div>`}></div>;
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ConfirmOptions {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalFuncProps = {
    centered: true,
    icon: getIcon(iconType),
    ...projectSetting.messageSetting,
    ...options,
  };
  return Modal.confirm(opt) as any;
}
const baseOptions = {
  okText: '确定',
  centered: true,
};

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  return {
    ...baseOptions,
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}
function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'));
}
function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'));
}
function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'));
}
function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'warning'));
}

notification.config({
  placement: 'topRight',
  duration: 3,
});
/**
 * @description: message
 */
export function useMessage() {
  return {
    createMessage: Message as MessageApi,
    notification: notification as (arg: ArgsProps) => void,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
