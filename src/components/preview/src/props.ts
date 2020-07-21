import { PropOptions } from 'compatible-vue';
import { Props } from './types';
export const basicProps = {
  show: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  instance: {
    type: Object,
    default: null,
  } as PropOptions<Props>,
  imageList: {
    type: [Array],
    default: null,
  } as PropOptions<string[]>,
  index: {
    type: Number,
    default: 0,
  },
};
