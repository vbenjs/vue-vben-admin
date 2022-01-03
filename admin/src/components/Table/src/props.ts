import type { PropType } from 'vue'
import type { PaginationProps } from './types/pagination'
import type {
  BasicColumn,
  FetchSetting,
  TableSetting,
  SorterResult,
  TableCustomRecord,
  TableRowSelection,
  SizeType,
} from './types/table'
import type { FormProps } from '@/components/Form'

import {
  DEFAULT_FILTER_FN,
  DEFAULT_SORT_FN,
  FETCH_SETTING,
  DEFAULT_SIZE,
} from './const'

export const basicProps = {
  clickToRowSelect: { type: Boolean, default: true },
  isTreeTable: Boolean,
  tableSetting: { type: Object as PropType<TableSetting> },
  inset: Boolean,
  sortFn: {
    type: Function as PropType<(sortInfo: SorterResult) => any>,
    default: DEFAULT_SORT_FN,
  },
  filterFn: {
    type: Function as PropType<(data: Partial<Recordable<string[]>>) => any>,
    default: DEFAULT_FILTER_FN,
  },
  showTableSetting: Boolean,
  autoCreateKey: { type: Boolean, default: true },
  striped: { type: Boolean, default: true },
  showSummary: Boolean,
  summaryFunc: {
    type: [Function, Array] as PropType<(...arg: any[]) => any[]>,
    default: null,
  },
  summaryData: {
    type: Array as PropType<Recordable[]>,
    default: null,
  },
  indentSize: { type: Number, default: 24 },
  canColDrag: { type: Boolean, default: true },
  api: {
    type: Function as PropType<(...arg: any[]) => Promise<any>>,
    default: null,
  },
  beforeFetch: {
    type: Function as PropType<AnyFunction<any>>,
    default: null,
  },
  afterFetch: {
    type: Function as PropType<AnyFunction<any>>,
    default: null,
  },
  handleSearchInfoFn: {
    type: Function as PropType<AnyFunction<any>>,
    default: null,
  },
  fetchSetting: {
    type: Object as PropType<FetchSetting>,
    default: () => {
      return FETCH_SETTING
    },
  },
  // 立即请求接口
  immediate: { type: Boolean, default: true },
  emptyDataIsShowTable: { type: Boolean, default: true },
  // 额外的请求参数
  searchInfo: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  // 默认的排序参数
  defSort: {
    type: Object as PropType<Recordable>,
    default: null,
  },
  // 使用搜索表单
  useSearchForm: { type: Boolean },
  // 表单配置
  formConfig: {
    type: Object as PropType<Partial<FormProps>>,
    default: null,
  },
  columns: {
    type: [Array] as PropType<BasicColumn[]>,
    default: () => [],
  },
  showIndexColumn: { type: Boolean, default: true },
  indexColumnProps: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  actionColumn: {
    type: Object as PropType<BasicColumn>,
    default: null,
  },
  ellipsis: { type: Boolean, default: true },
  isCanResizeParent: { type: Boolean, default: false },
  canResize: { type: Boolean, default: true },
  clearSelectOnPageChange: { type: Boolean },
  resizeHeightOffset: { type: Number, default: 0 },
  rowSelection: {
    type: Object as PropType<TableRowSelection | null>,
    default: null,
  },
  title: {
    type: [String, Function] as PropType<
      string | ((data: Recordable) => string)
    >,
    default: null,
  },
  titleHelpMessage: {
    type: [String, Array] as PropType<string | string[]>,
  },
  maxHeight: { type: Number },
  dataSource: {
    type: Array as PropType<Recordable[]>,
    default: null,
  },
  rowKey: {
    type: [String, Function] as PropType<
      string | ((record: Recordable) => string)
    >,
    default: '',
  },
  bordered: { type: Boolean },
  pagination: {
    type: [Object, Boolean] as PropType<PaginationProps | boolean>,
    default: null,
  },
  loading: { type: Boolean },
  rowClassName: {
    type: Function as PropType<
      (record: TableCustomRecord<any>, index: number) => string
    >,
  },
  scroll: {
    type: Object as PropType<{ x: number | true; y: number }>,
    default: null,
  },
  beforeEditSubmit: {
    type: Function as PropType<
      (data: {
        record: Recordable
        index: number
        key: string | number
        value: any
      }) => Promise<any>
    >,
  },
  size: {
    type: String as PropType<SizeType>,
    default: DEFAULT_SIZE,
  },
}
