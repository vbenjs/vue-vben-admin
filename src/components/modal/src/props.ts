import { PropOptions } from 'compatible-vue';
// import {PropType} from 'compatible-vue'
export const modalProps = {
  // 是否开启拖拽事件
  draggable: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  centered: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  cancelText: {
    type: String,
    default: '关闭',
  } as PropOptions<string>,
  okText: {
    type: String,
    default: '保存',
  } as PropOptions<string>,
  closeFunc: Function as PropOptions<() => Promise<any>>,
};

export const basicProps = Object.assign({}, modalProps, {
  // 是否可以进行全屏
  canFullscreen: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  // 温馨提醒信息
  helpMessage: [String, Array] as PropOptions<string | string[]>,
  // 是否使用wrapper
  useWrapper: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  loading: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  /**
   * @description: 显示关闭按钮
   */
  showCancelBtn: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  /**
   * @description: 显示确认按钮
   */
  showOkBtn: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  wrapperProps: Object as PropOptions<any>,

  afterClose: Function as PropOptions<() => Promise<any>>,

  bodyStyle: Object as PropOptions<any>,

  closable: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  closeIcon: Object as PropOptions<any>,

  confirmLoading: Boolean as PropOptions<boolean>,

  destroyOnClose: Boolean as PropOptions<boolean>,

  footer: Object as PropOptions<any>,

  getContainer: Function as PropOptions<() => any>,

  mask: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  maskClosable: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  keyboard: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  maskStyle: Object as PropOptions<any>,

  okType: {
    type: String,
    default: 'primary',
  } as PropOptions<string>,

  okButtonProps: Object as PropOptions<any>,

  cancelButtonProps: Object as PropOptions<any>,

  title: [String] as PropOptions<string>,

  visible: Boolean as PropOptions<boolean>,

  width: [String, Number] as PropOptions<string | number>,

  wrapClassName: String as PropOptions<string>,

  zIndex: Number as PropOptions<number>,
});
