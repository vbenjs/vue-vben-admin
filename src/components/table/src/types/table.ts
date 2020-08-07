import { VNode } from 'compatible-vue';
import { PaginationProps } from './pagination';
import { FormProps } from '@/components/form/index';
import { ScopedSlot } from 'vue/types/vnode';
import { TableRowSelection } from 'ant-design-vue/types/table/table';
import { ComponentType } from './componentType';
export declare type SortOrder = 'ascend' | 'descend';
export interface ColumnFilterItem {
  text?: string;
  value?: string;
  children?: any;
}

export interface RenderEditableCellParams {
  dataIndex: string;
  component?: ComponentType;
  componentOn?: { [key: string]: (...arg) => any };
  componentProps?: any;
}
export interface Scroll {
  x?: number | boolean | string;
  y?: number | null;
  scrollToFirstRowOnChange?: boolean;
}
export interface FetchParams {
  searchInfo?: any;
  page?: number;
}

export interface getColumnsParams {
  ignoreIndex?: boolean;
}
export interface TableInstance {
  reload: (opt?: FetchParams) => Promise<void>;
  getSelectRows: () => any[];
  clearSelectedRowKeys: () => void;
  getSelectRowKeys: () => string[];
  deleteSelectRowByKey: (key: string) => void;
  setPagination: (info: Partial<PaginationProps>) => void;
  setTableData: (values: any[]) => void;
  getColumns: ({ ignoreIndex }?: getColumnsParams) => BasicColumn[];
  setColumns: (columns: BasicColumn[] | string[]) => void;
  getDataSource: () => any[];
  setLoading: (loading: boolean) => void;
  setProps: (props: Partial<BasicTableProps>) => void;
  redoHeight: () => void;
  setSelectedRowKeys: (rowKeys: string[]) => void;
  getPaginationRef: () => PaginationProps;
}

export interface FetchSetting {
  // 请求接口当前页数
  pageField: string;
  // 每页显示多少条
  sizeField: string;
  // 请求结果列表字段  支持 a.b.c
  listField: string;
  // 请求结果总数字段  支持 a.b.c
  totalField: string;
}
export interface BasicTableProps {
  // 计算合计行的方法
  summaryFunc?: (...arg) => any[];
  // 是否显示合计行
  showSummary?: boolean;
  // 是否可拖拽行排序
  canRowDrag?: boolean;

  // 是否可拖拽列
  canColDrag?: boolean;
  // 是否树表
  isTreeTable?: boolean;
  // 接口请求对象
  api?: (...arg) => Promise<any>;
  // 请求之前处理参数
  beforeFetch?: (...arg) => any;
  // 自定义处理接口返回参数
  afterFetch?: (...arg) => any;
  // 查询条件请求之前处理
  handleSearchInfoFn?: (...arg) => any;
  // 请求接口配置
  fetchSetting?: FetchSetting;
  // 立即请求接口
  immediate?: boolean;
  // 额外的请求参数
  searchInfo?: any;

  // 使用搜索表单
  useSearchForm?: boolean;
  // 表单配置
  formConfig?: FormProps;
  // 列配置
  columns: BasicColumn[];
  // 是否显示序号列
  showIndexColumn?: boolean;
  // 序号列配置
  indexColumnProps?: BasicColumn;
  actionColumn?: BasicColumn;
  // 文本超过宽度是否显示。。。
  ellipsis?: boolean;
  size?: 'default' | 'middle' | 'small' | 'large';
  // 选择配置
  rowSelection?: TableRowSelection | null;
  // 是否可以自适应高度
  canResize?: boolean;
  // 自适应高度偏移， 计算结果-偏移量
  resizeHeightOffset?: number;

  // 在分页改变的时候清空选项
  clearSelectOnPageChange?: boolean;
  //
  rowKey?: string | ((record: any) => string);
  // 数据
  dataSource?: any[];
  // 标题
  title?: string | ((data: any) => any);
  // 标题右侧提示
  titleHelpMessage?: string | string[];
  // 表格滚动最大高度
  maxHeight?: number;
  // 是否显示边框
  bordered?: boolean;
  // 分页配置
  pagination?: PaginationProps | false;
  // loading加载
  loading?: boolean;

  scroll?: Scroll;

  tableLayout?: 'fixed' | 'auto';

  /**
   * The column contains children to display
   * @default 'children'
   * @type string | string[]
   */
  childrenColumnName: string | string[];

  /**
   * Override default table elements
   * @type object
   */
  components: object;

  /**
   * Expand all rows initially
   * @default false
   * @type boolean
   */
  defaultExpandAllRows: boolean;

  /**
   * Initial expanded row keys
   * @type string[]
   */
  defaultExpandedRowKeys: string[];

  /**
   * Current expanded row keys
   * @type string[]
   */
  expandedRowKeys: string[];

  /**
   * Expanded container render for each row
   * @type Function
   */
  expandedRowRender: (record: any, index: number, indent: number, expanded: boolean) => any;

  /**
   * Customize row expand Icon.
   * @type Function | ScopedSlot
   */
  expandIcon: ((...arg) => VNode | VNode[]) | ScopedSlot;

  /**
   * Whether to expand row by clicking anywhere in the whole row
   * @default false
   * @type boolean
   */
  expandRowByClick: boolean;

  /**
   * Table footer renderer
   * @type Function | ScopedSlot
   */
  footer: Function | ScopedSlot;

  /**
   * Indent size in pixels of tree data
   * @default 15
   * @type number
   */
  indentSize: number;

  /**
   * i18n text including filter, sort, empty text, etc
   * @default { filterConfirm: 'Ok', filterReset: 'Reset', emptyText: 'No Data' }
   * @type object
   */
  locale: object;

  /**
   * Row's className
   * @type Function
   */
  rowClassName: (record: any, index: number) => string;

  /**
   * Whether to show table header
   * @default true
   * @type boolean
   */
  showHeader: boolean;

  /**
   * Set props on per header row
   * @type Function
   */
  customHeaderRow: (
    column: any,
    index: number
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Set props on per row
   * @type Function
   */
  customRow: (
    record: any,
    index: number
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };
  transformCellText: Function;
}

export interface BasicColumn {
  children?: BasicColumn[];
  //
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';

  /**
   * specify how content is aligned
   * @default 'left'
   * @type string
   */
  align?: 'left' | 'right' | 'center';

  /**
   * ellipsize cell content, not working with sorter and filters for now.
   * tableLayout would be fixed when ellipsis is true.
   * @default false
   * @type boolean
   */
  ellipsis?: boolean;

  /**
   * Span of this column's title
   * @type number
   */
  colSpan?: number;

  /**
   * Display field of the data record, could be set like a.b.c
   * @type string
   */
  dataIndex?: string;

  /**
   * Default filtered values
   * @type string[]
   */
  defaultFilteredValue?: string[];

  /**
   * Default order of sorted values: 'ascend' 'descend' null
   * @type string
   */
  defaultSortOrder?: SortOrder;

  /**
   * Customized filter overlay
   * @type any (slot)
   */
  filterDropdown?: any;

  /**
   * Whether filterDropdown is visible
   * @type boolean
   */
  filterDropdownVisible?: boolean;

  /**
   * Whether the dataSource is filtered
   * @default false
   * @type boolean
   */
  filtered?: boolean;

  /**
   * Controlled filtered value, filter icon will highlight
   * @type string[]
   */
  filteredValue?: string[];

  /**
   * Customized filter icon
   * @default false
   * @type any
   */
  filterIcon?: any;

  /**
   * Whether multiple filters can be selected
   * @default true
   * @type boolean
   */
  filterMultiple?: boolean;

  /**
   * Filter menu config
   * @type object[]
   */
  filters?: ColumnFilterItem[];

  /**
   * Set column to be fixed: true(same as left) 'left' 'right'
   * @default false
   * @type boolean | string
   */
  fixed?: boolean | 'left' | 'right';

  /**
   * Unique key of this column, you can ignore this prop if you've set a unique dataIndex
   * @type string
   */
  key?: string;

  /**
   * Renderer of the table cell. The return value should be a VNode, or an object for colSpan/rowSpan config
   * @type Function | ScopedSlot
   */
  customRender?: Function | ScopedSlot | string;

  /**
   * Sort function for local sort, see Array.sort's compareFunction. If you need sort buttons only, set to true
   * @type boolean | Function
   */
  sorter?: boolean | Function;

  /**
   * Order of sorted values: 'ascend' 'descend' false
   * @type boolean | string
   */
  sortOrder?: boolean | SortOrder;

  /**
   * supported sort way, could be 'ascend', 'descend'
   * @default ['ascend', 'descend']
   * @type string[]
   */
  sortDirections?: string[];

  /**
   * Title of this column
   * @type any (string | slot)
   */
  title?: any;

  /**
   * Width of this column
   * @type string | number
   */
  width?: string | number;

  /**
   * Set props on per cell
   * @type Function
   */
  customCell?: (
    record: any,
    rowIndex: number
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Set props on per header cell
   * @type
   */
  customHeaderCell?: (
    column: any
  ) => {
    props: object;
    attrs: object;
    on: object;
    class: object;
    style: object;
    nativeOn: object;
  };

  /**
   * Callback executed when the confirm filter button is clicked, Use as a filter event when using template or jsx
   * @type Function
   */
  onFilter?: Function;

  /**
   * Callback executed when filterDropdownVisible is changed, Use as a filterDropdownVisible event when using template or jsx
   * @type Function
   */
  onFilterDropdownVisibleChange?: (visible: boolean) => void;

  /**
   * When using columns, you can use this property to configure the properties that support the slot,
   * such as slots: { filterIcon: 'XXX'}
   * @type object
   */
  slots?: object;

  /**
   * When using columns, you can use this property to configure the properties that support the slot-scope,
   * such as scopedSlots: { customRender: 'XXX'}
   * @type object
   */
  scopedSlots?: object;
  renderType?: string;
}
