import { PropOptions } from 'compatible-vue';
import { Axis, ContextMenuItem } from './types';
export const props = {
  width: {
    type: Number,
    default: 180,
  },
  customEvent: {
    type: Object,
    default: null,
  } as PropOptions<Event>,
  // 样式
  styles: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  showIcon: {
    // 是否显示icon
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  axis: {
    // 鼠标右键点击的位置
    type: Object,
    default() {
      return { x: 0, y: 0 };
    },
  } as PropOptions<Axis>,
  items: {
    // 最重要的列表，没有的话直接不显示
    type: Array,
    default() {
      return [];
    },
  } as PropOptions<ContextMenuItem[]>,
  resolve: {
    type: Function,
    default: null,
  } as PropOptions<any>,
};
