import { PropOptions } from '@/setup/vue';
import { DescItem } from './type';
// import { CollapseContainerOptions } from '@/components/container/index';

export default {
  title: {
    type: String,
    default: '',
  },
  size: {
    type: String,
    default: 'small',
  },
  bordered: {
    type: Boolean,
    default: true,
  },
  column: {
    type: [Number, Object],
    default: () => {
      return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
    },
  },
  collapseOptions: {
    type: Object,
    default: null,
  },
  // as PropOptions<CollapseContainerOptions>,
  schema: {
    type: Array,
    default: () => [],
  } as PropOptions<Array<DescItem>>,
  data: {
    type: Object,
    default: null,
  },
};
