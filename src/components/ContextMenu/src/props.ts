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
  styles: {
    type: Object as PropType<any>,
    default: null,
  },
  showIcon: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  axis: {
    // The position of the right mouse button click
    type: Object as PropType<Axis>,
    default() {
      return { x: 0, y: 0 };
    },
  },
  items: {
    // The most important list, if not, will not be displayed
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
