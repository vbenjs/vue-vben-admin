import { PropOptions } from 'compatible-vue';
import { PaginationProps } from './types/pagination';
import { Scroll, BasicColumn, FetchSetting } from './types/table';
import { TableRowSelection } from 'ant-design-vue/types/table/table';
import { FormProps } from '@/components/form/index';

// 注释看 types/table
export const basicProps = {
  showSummary: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,

  summaryFunc: {
    type: [Function, Array],
    default: null,
  } as PropOptions<(...arg) => any[]>,
  canRowDrag: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  canColDrag: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  isTreeTable: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  api: {
    type: Function,
    default: null,
  } as PropOptions<(...arg) => Promise<any>>,
  beforeFetch: {
    type: Function,
    default: null,
  } as PropOptions<(...arg) => any>,
  afterFetch: {
    type: Function,
    default: null,
  } as PropOptions<(...arg) => any>,

  handleSearchInfoFn: {
    type: Function,
    default: null,
  } as PropOptions<(...arg) => any>,
  fetchSetting: {
    type: Object,
    default: () => {
      return {
        pageField: 'page',
        sizeField: 'pageSize',
        listField: 'items',
        totalField: 'total',
      };
    },
  } as PropOptions<FetchSetting>,
  // 立即请求接口
  immediate: { type: Boolean, default: true } as PropOptions<any>,
  // 额外的请求参数
  searchInfo: {
    type: Object,
    default: null,
  } as PropOptions<any>,
  // 使用搜索表单
  useSearchForm: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  // 表单配置
  formConfig: {
    type: Object,
    default: null,
  } as PropOptions<Partial<FormProps>>,
  columns: {
    type: [Array],
    default: null,
  } as PropOptions<BasicColumn[]>,
  showIndexColumn: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  indexColumnProps: {
    type: Object,
    default: null,
  } as PropOptions<BasicColumn>,
  actionColumn: {
    type: Object,
    default: null,
  } as PropOptions<BasicColumn>,
  ellipsis: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  canResize: {
    type: Boolean,
    default: true,
  } as PropOptions<boolean>,
  clearSelectOnPageChange: {
    type: Boolean,
    default: false,
  } as PropOptions<boolean>,
  resizeHeightOffset: {
    type: Number,
    default: 0,
  } as PropOptions<number>,
  rowSelection: {
    type: Object,
    default: null,
  } as PropOptions<TableRowSelection | null>,
  title: {
    type: [String, Function],
    default: null,
  } as PropOptions<string | ((data: any) => any)>,
  titleHelpMessage: {
    type: [String, Array],
  } as PropOptions<string | string[]>,
  maxHeight: {
    type: Number,
  } as PropOptions<number>,
  dataSource: {
    type: Array,
    default: null,
  } as PropOptions<any[]>,
  rowKey: {
    type: [String, Function],
    default: '',
  } as PropOptions<string | ((record: any) => string)>,
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
