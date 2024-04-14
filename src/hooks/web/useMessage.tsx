import type { ModalFuncProps } from 'ant-design-vue/lib/modal/Modal';
import { Modal, message as Message, notification } from 'ant-design-vue';
import { InfoCircleFilled, CheckCircleFilled, CloseCircleFilled } from '@ant-design/icons-vue';
import { NotificationArgsProps, ConfigProps } from 'ant-design-vue/lib/notification';
import { useI18n } from './useI18n';
import { isString } from '@/utils/is';
import { Result } from '#/axios';
import { useSystemExceptionStore } from '@/store/modules/exception';
import { Button, ButtonProps } from '@/components/Button';
import { createVNode } from 'vue';

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
  buttons?: Array<string | (ButtonProps & { name: string })>;
  footerProps?: Recordable;
}
export type ModalOptionsPartial = Partial<ModalOptionsEx> & Pick<ModalOptionsEx, 'content'>;

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
  if (isString(content)) {
    return <div innerHTML={`<div>${content as string}</div>`}></div>;
  } else {
    return content;
  }
}

/**
 * @description: Create confirmation box
 */
function createConfirm(options: ModalOptionsEx) {
  const iconType = options.iconType || 'warning';
  Reflect.deleteProperty(options, 'iconType');
  const modalOptions = createModalOptions(
    {
      ...options,
      footerProps: {
        ...(options.footerProps || {}),
        class: ['ant-modal-confirm-btns'],
      },
    },
    iconType,
  );
  return Modal.confirm({
    ...modalOptions,
  });
}

const getBaseOptions = () => {
  const { t } = useI18n();
  return {
    okText: t('common.okText'),
    centered: true,
  };
};

function createModalOptions(options: ModalOptionsPartial, icon: string): ModalOptionsPartial {
  const { buttons, footerProps } = options;
  const modalOptions: ModalOptionsPartial = {
    ...getBaseOptions(),
    ...options,
    content: renderContent(options),
    icon: getIcon(icon),
  };
  if (!buttons) {
    return modalOptions;
  }
  const buttonsSlots = () =>
    buttons.map((button) => {
      const stringYn = isString(button);
      const buttonName = stringYn ? button : button.name;
      const buttonProps = stringYn ? {} : button;
      return <Button {...buttonProps}>{buttonName}</Button>;
    });

  const footer = () => createVNode('div', footerProps || {}, { default: buttonsSlots });
  return {
    ...modalOptions,
    footer,
  };
}

function createSuccessModal(options: ModalOptionsPartial) {
  return Modal.success(createModalOptions(options, 'success'));
}

function createErrorModal(options: ModalOptionsPartial) {
  return Modal.error(createModalOptions(options, 'error'));
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
    createMessage: Message,
    notification: notification as NotifyApi,
    createConfirm,
    createSuccessModal,
    createErrorModal,
    createInfoModal,
    createWarningModal,
    successMessage,
    warnMessage,
    errorMessage,
    createError500Modal,
  };
}

export interface MessageOptions {
  message: string;
}

/**
 * 成功
 * @param options
 */
const successMessage = (options: MessageOptions | string) => {
  if (isString(options)) {
    return Message.success(options);
  }
  return Message.success(options.message);
};

const warnMessage = (options: MessageOptions | string) => {
  if (isString(options)) {
    return Message.warning(options);
  }
  return Message.warning(options.message);
};

/**
 * 500错误弹窗
 * @param e
 */
const createError500Modal = (e: Result) => {
  const { exceptionNo } = e;
  const systemExceptionStore = useSystemExceptionStore();
  systemExceptionStore.handleShowExceptionModal(exceptionNo!);
};

const errorMessage = (e: Result | string | Error) => {
  if (isString(e)) {
    return Message.error(e);
  }
  console.error(e);
  const code = (e as any).code;
  switch (code) {
    case 500: {
      return createError500Modal(e as Result);
    }
    default:
      return Message.error(e.message);
  }
};
