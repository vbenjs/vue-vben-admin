import type { ModalOptionsEx, ModalOptionsPartial } from '/@/hooks/core/types';

import { Modal, message as Message, notification } from 'ant-design-vue';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { ModalOptions, ModalConfirm } from 'ant-design-vue/types/modal';

import { useSetting } from '/@/hooks/core/useSetting';

const { projectSetting } = useSetting();

function getIcon(iconType: string) {
  if (iconType === 'warning') {
    return <InfoCircleFilled class="modal-icon-warning" />;
  } else if (iconType === 'success') {
    return <CheckCircleFilled class="modal-icon-success" />;
  } else {
    return <CloseCircleFilled class="modal-icon-error" />;
  }
}
function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  return <div innerHTML={`<div>${content}</div>`}></div>;
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx): ModalConfirm {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalOptions = {
    centered: true,
    icon: getIcon(iconType),
    ...projectSetting.messageSetting,
    ...options,
  };
  return Modal.confirm(opt);
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
  return Modal.success(createModalOptions(options, 'check'));
}
function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'close'));
}
function createInfoModal(options: ModalOptionsPartial) {
  return Modal.info(createModalOptions(options, 'info'));
}
function createWarningModal(options: ModalOptionsPartial) {
  return Modal.warning(createModalOptions(options, 'info'));
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
    createMessage: Message,
    notification,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
