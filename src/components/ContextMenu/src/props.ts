import type { PropType } from 'vue';
import type { Axis, ContextMenuItem } from './types';
import { propTypes } from '/@/utils/propTypes';
export const contextMenuProps = {
  width: propTypes.number.def(156),
  customEvent: {
    type: Object as PropType<Event>,
    default: null,
  },
  styles: propTypes.style,
  showIcon: propTypes.bool.def(true),
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
};
