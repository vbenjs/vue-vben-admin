import { Vue } from 'compatible-vue';
import { Modal, message as Message } from 'ant-design-vue';
import { Icon } from '@/components/icon/index';
import { ModalOptions, ModalConfirm } from 'ant-design-vue/types/modal';

import { ModalOptionsEx, ModalOptionsPartial } from './types';

import { useSetting } from '@/hooks/core/useSetting';

const { projectSetting } = useSetting();

function getIconStyle(iconType) {
  if (iconType === 'warning') {
    return 'info';
  } else if (iconType === 'success') {
    return 'check';
  } else {
    return 'close';
  }
}
function renderIcon(name: string) {
  // @ts-ignore
  const h = new Vue().$createElement;
  return () => <Icon as type={`${name}-circle`} theme="filled" />;
}
function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  // @ts-ignore
  const h = new Vue().$createElement;
  return <div domPropsInnerHTML={`<div>${content}</div>`}></div>;
}

/**
 * @description: 创建确认框
 */
function createConfirm(options: ModalOptionsEx): ModalConfirm {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const opt: ModalOptions = {
    centered: true,
    icon: (renderIcon(getIconStyle(iconType)) as unknown) as Function,
    class: iconType,
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
    icon: renderIcon(icon),
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

/**
 * @description: 消息
 */
export function useMessage() {
  return {
    createMessage: Message,
    createConfirm: createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
}
