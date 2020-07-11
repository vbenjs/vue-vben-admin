import { PropOptions } from 'compatible-vue';
import { DrawerType } from './types';
// import {DrawerProps} from './types'

export const basicProps = {
  drawerType: {
    type: Number,
    default: DrawerType.DEFAULT,
  } as PropOptions<number>,
  title: {
    type: String,
    default: '',
  } as PropOptions<string>,
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
};
