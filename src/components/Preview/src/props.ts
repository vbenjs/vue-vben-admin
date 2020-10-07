import { PropType } from 'vue';
export const basicProps = {
  show: {
    type: Boolean as PropType<boolean>,
    default: false,
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
