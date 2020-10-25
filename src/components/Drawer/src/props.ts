import type { PropType } from 'vue';
// import {DrawerProps} from './types'
export const footerProps = {
  confirmLoading: Boolean as PropType<boolean>,
  /**
   * @description: 显示关闭按钮
   */
  showCancelBtn: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  cancelButtonProps: Object as PropType<any>,
  cancelText: {
    type: String as PropType<string>,
    default: '关闭',
  },
  /**
   * @description: 显示确认按钮
   */
  showOkBtn: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  okButtonProps: Object as PropType<any>,
  okText: {
    type: String as PropType<string>,
    default: '保存',
  },
  okType: {
    type: String as PropType<string>,
    default: 'primary',
  },
  showFooter: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  footerHeight: {
    type: [String, Number] as PropType<string | number>,
    default: 60,
  },
};
export const basicProps = {
  isDetail: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  title: {
    type: String as PropType<string>,
    default: '',
  },
  showDetailBack: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  visible: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  loading: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  maskClosable: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  getContainer: {
    type: [Object, String] as PropType<any>,
  },
  scrollOptions: {
    type: Object as PropType<any>,
    default: null,
  },
  closeFunc: {
    type: [Function, Object] as PropType<any>,
    default: null,
  },
  triggerWindowResize: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  destroyOnClose: Boolean as PropType<boolean>,
  ...footerProps,
};
