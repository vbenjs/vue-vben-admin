import type { PropType } from 'vue';
import type { Axis, ContextMenuItem } from './types';
export const props = {
  width: {
    type: Number as PropType<number>,
    default: 180,
  },
  customEvent: {
    type: Object as PropType<Event>,
    default: null,
  },
  // 样式
  styles: {
    type: Object as PropType<any>,
    default: null,
  },
  showIcon: {
    // 是否显示icon
    type: Boolean as PropType<boolean>,
    default: true,
  },
  axis: {
    // 鼠标右键点击的位置
    type: Object as PropType<Axis>,
    default() {
      return { x: 0, y: 0 };
    },
  },
  items: {
    // 最重要的列表，没有的话直接不显示
    type: Array as PropType<ContextMenuItem[]>,
    default() {
      return [];
    },
  },
  resolve: {
    type: Function as PropType<any>,
    default: null,
  },
};
