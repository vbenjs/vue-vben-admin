import { PropType } from 'vue';
import { Props } from './types';
export const basicProps = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false,
  },
  instance: {
    type: Object as PropType<Props>,
    default: null,
  },
  imageList: {
    type: [Array] as PropType<string[]>,
    default: null,
  },
  index: {
    type: Number as PropType<number>,
    default: 0,
  },
};
