import type { PropType } from 'vue';
import type { DescItem } from './types';

export default {
  useCollapse: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  title: {
    type: String as PropType<string>,
    default: '',
  },
  size: {
    type: String as PropType<'small' | 'default' | 'middle' | undefined>,
    default: 'small',
  },
  bordered: {
    type: Boolean as PropType<boolean>,
    default: true,
  },
  column: {
    type: [Number, Object] as PropType<number | any>,
    default: () => {
      return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
    },
  },
  collapseOptions: {
    type: Object as PropType<any>,
    default: null,
  },
  schema: {
    type: Array as PropType<Array<DescItem>>,
    default: () => [],
  },
  data: {
    type: Object as PropType<any>,
    default: null,
  },
};
