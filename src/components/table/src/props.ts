import { PropOptions } from 'compatible-vue';
import { PaginationProps } from './types/pagination';
import { Scroll } from './types/table';
export const basicProps = {
  canResize: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,

  resizeHeightOffset: {
    type: Number,
    default: 0,
  } as PropOptions<number>,

  maxHeight: {
    type: Number,
  } as PropOptions<number>,

  bordered: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  pagination: {
    type: [Object, Boolean],
    default: null,
  } as PropOptions<PaginationProps | boolean>,

  loading: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  scroll: {
    type: Object,
    default: null,
  } as PropOptions<Scroll>,
};
