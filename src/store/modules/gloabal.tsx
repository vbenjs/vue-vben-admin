import { App, notification } from 'ant-design-vue';
import type { MessageInstance } from 'ant-design-vue/es/message/interface';
import type { ModalStaticFunctions } from 'ant-design-vue/es/modal/confirm';
import type { NotificationInstance } from 'ant-design-vue/es/notification/interface';
import type { ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { defineStore } from 'pinia';
import { ref } from 'vue';
import { store } from '@/store';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import type { NotificationArgsProps, ConfigProps } from 'ant-design-vue/lib/notification';
import { isString } from '@/utils/is';

export interface NotifyApi {
  info(config: NotificationArgsProps): void;
  success(config: NotificationArgsProps): void;
  error(config: NotificationArgsProps): void;
  warn(config: NotificationArgsProps): void;
  warning(config: NotificationArgsProps): void;
  open(args: NotificationArgsProps): void;
  close(key: String): void;
  config(options: ConfigProps): void;
  destroy(): void;
}

export declare type NotificationPlacement = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';
export declare type IconType = 'success' | 'info' | 'error' | 'warning';
export interface ModalOptionsEx extends Omit<ModalFuncProps, 'iconType'> {
  iconType: 'warning' | 'success' | 'error' | 'info';
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

export function getIcon(iconType: string) {
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

export function renderContent({ content }: Pick<ModalOptionsEx, 'content'>) {
  if (isString(content)) {
    return <div innerHTML={`<div>${content as string}</div>`}></div>;
  } else {
    return content;
  }
}

const getBaseOptions = () => {
  return {
    okText: '确认',
    centered: true,
  };
};

export function createModalOptions(
  options: ModalOptionsPartial,
  icon: string,
): ModalOptionsPartial {
  return {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
}

notification.config({
  placement: 'topRight',
  duration: 3,
});

export const useGlobalStore = defineStore('global', () => {
  const message = ref<MessageInstance>();
  const notification = ref<NotificationInstance>();
  const modal = ref<Omit<ModalStaticFunctions, 'warn'>>();

  (() => {
    const staticFunction = App.useApp();

    message.value = staticFunction.message;
    modal.value = staticFunction.modal;
    notification.value = staticFunction.notification;
  })();

  /**
   * @description: Create confirmation box
   */
  function createConfirm(options: ModalOptionsEx) {
    const iconType = options.iconType || 'warning';
    Reflect.deleteProperty(options, 'iconType');
    const opt: ModalFuncProps = {
      centered: true,
      icon: getIcon(iconType),
      ...options,
      content: renderContent(options),
    };
    return modal.value?.confirm(opt);
  }

  function createSuccessModal(options: ModalOptionsPartial) {
    return modal.value?.success(createModalOptions(options, 'success'));
  }

  function createErrorModal(options: ModalOptionsPartial) {
    return modal.value?.error(createModalOptions(options, 'error'));
  }

  function createInfoModal(options: ModalOptionsPartial) {
    return modal.value?.info(createModalOptions(options, 'info'));
  }

  function createWarningModal(options: ModalOptionsPartial) {
    return modal.value?.warning(createModalOptions(options, 'warning'));
  }

  return {
    message,
    notification,
    modal,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
  };
});

// Need to be used outside the setup
export function useGlobalStoreWithOut() {
  return useGlobalStore(store);
}
