import type { PropType } from 'vue';
import { ButtonProps } from 'ant-design-vue/es/button/buttonTypes';

import { useI18n } from '/@/hooks/web/useI18n';
import { propTypes } from '/@/utils/propTypes';
const { t } = useI18n();

export const modalProps = {
  visible: propTypes.bool,
  // open drag
  draggable: propTypes.bool.def(true),
  centered: propTypes.bool,
  cancelText: propTypes.string.def(t('component.modal.cancelText')),
  okText: propTypes.string.def(t('component.modal.okText')),

  closeFunc: Function as PropType<() => Promise<boolean>>,
};

export const basicProps = Object.assign({}, modalProps, {
  // Can it be full screen
  canFullscreen: propTypes.bool.def(true),
  // After enabling the wrapper, the bottom can be increased in height
  wrapperFooterOffset: propTypes.number.def(0),
  // Warm reminder message
  helpMessage: [String, Array] as PropType<string | string[]>,
  // Whether to setting wrapper
  useWrapper: propTypes.bool.def(true),
  loading: propTypes.bool,
  /**
   * @description: Show close button
   */
  showCancelBtn: propTypes.bool.def(true),
  /**
   * @description: Show confirmation button
   */
  showOkBtn: propTypes.bool.def(true),

  wrapperProps: Object as PropType<any>,

  afterClose: Function as PropType<() => Promise<any>>,

  bodyStyle: Object as PropType<any>,

  closable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  closeIcon: Object as PropType<any>,

  confirmLoading: Boolean as PropType<boolean>,

  destroyOnClose: Boolean as PropType<boolean>,

  footer: Object as PropType<any>,

  getContainer: Function as PropType<() => any>,

  mask: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  maskClosable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  keyboard: {
    type: Boolean as PropType<boolean>,
    default: true,
  },

  maskStyle: Object as PropType<any>,

  okType: {
    type: String as PropType<string>,
    default: 'primary',
  },

  okButtonProps: Object as PropType<ButtonProps>,

  cancelButtonProps: Object as PropType<ButtonProps>,

  title: {
    type: String as PropType<string>,
  },

  visible: Boolean as PropType<boolean>,

  width: [String, Number] as PropType<string | number>,

  wrapClassName: {
    type: String as PropType<string>,
  },

  zIndex: {
    type: Number as PropType<number>,
  },
});
