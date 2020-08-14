import { PropOptions } from 'compatible-vue';
import { DrawerType } from './types';
// import {DrawerProps} from './types'
export const footerProps = {
  confirmLoading: Boolean as PropOptions<boolean>,
  /**
   * @description: 显示关闭按钮
   */
  showCancelBtn: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  cancelButtonProps: Object as PropOptions<any>,
  cancelText: {
    type: String,
    default: '关闭',
  } as PropOptions<string>,
  /**
   * @description: 显示确认按钮
   */
  showOkBtn: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  okButtonProps: Object as PropOptions<any>,
  okText: {
    type: String,
    default: '保存',
  } as PropOptions<string>,
  okType: {
    type: String,
    default: 'primary',
  } as PropOptions<string>,
  showFooter: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  footerHeight: {
    type: [String, Number],
    default: 60,
  } as PropOptions<string | number>,
};
export const basicProps = {
  drawerType: {
    type: Number,
    default: DrawerType.DEFAULT,
  } as PropOptions<number>,
  title: {
    type: String,
    default: '',
  } as PropOptions<string>,
  showDetailBack: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  visible: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  loading: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  maskClosable: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  getContainer: {
    type: [Object, String],
  } as PropOptions<any>,
  scrollOptions: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  closeFunc: {
    type: [Function, Object],
    default: null,
  } as PropOptions<any>,
  triggerWindowResize: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  destroyOnClose: Boolean as PropOptions<boolean>,
  ...footerProps,
};
