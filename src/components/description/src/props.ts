import { PropOptions } from 'compatible-vue';
import { DescItem } from './type';
// import { CollapseContainerOptions } from '@/components/container/index';

export default {
  useCollapse: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  title: {
    type: String,
    default: '',
  } as PropOptions<string>,
  size: {
    type: String,
    default: 'small',
  } as PropOptions<string>,
  bordered: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  column: {
    type: [Number, Object],
    default: () => {
      return { xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 };
    },
  } as PropOptions<number | any>,
  collapseOptions: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  // as PropOptions<CollapseContainerOptions>,
  schema: {
    type: Array,
    default: () => [],
  } as PropOptions<Array<DescItem>>,
  data: {
    type: Object,
    default: null,
  } as PropOptions<any>,
};
