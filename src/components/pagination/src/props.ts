import { isDevMode } from '@/utils/envUtil';
import { PaginationEnum } from '@/enums/paginationEnum';

export const paginationProps = {
  /**
   * total number of data items
   * @default 0
   * @type number
   */
  total: [Number],

  /**
   * default initial page number
   * @default 1
   * @type number
   */
  defaultCurrent: [Number],

  /**
   * current page number
   * @type number
   */
  current: {
    type: Number,
    default: 1,
  },

  /**
   * default number of data items per page
   * @default 10
   * @type number
   */
  defaultPageSize: {
    type: Number,
    default: PaginationEnum.DEFAULT_PAGE_SIZE,
  },

  /**
   * number of data items per page
   * @type number
   */
  pageSize: {
    type: Number,
    default: PaginationEnum.DEFAULT_PAGE_SIZE,
  },

  /**
   * Whether to hide pager on single page
   * @default false
   * @type boolean
   */
  hideOnSinglePage: [Boolean],

  /**
   * determine whether pageSize can be changed
   * @default false
   * @type boolean
   */
  showSizeChanger: {
    type: Boolean,
    default: true,
  },

  /**
   * specify the sizeChanger options
   * @default ['10', '20', '30', '40']
   * @type string[]
   */
  pageSizeOptions: {
    type: Array,
    default: () => {
      const ret = [`${PaginationEnum.DEFAULT_PAGE_SIZE}`, '50', '100', '200', '300'];

      isDevMode() && ret.unshift('1');
      return ret;
    },
  },

  /**
   * determine whether you can jump to pages directly
   * @default false
   * @type boolean
   */
  showQuickJumper: {
    type: [Boolean, Object],
    default: true,
  },

  /**
   * to display the total number and range
   * @type Function
   */
  showTotal: {
    type: Function,
    default: (total: number, range: number) => {
      return `总共 ${total} 条 显示 ${range[0]} 到 ${range[1]} 条`;
    },
  },

  /**
   * specify the size of Pagination, can be set to small
   * @default ''
   * @type string
   */
  size: String,

  /**
   * whether to use simple mode
   * @type boolean
   */
  simple: [Boolean],

  /**
   * to customize item innerHTML
   * @type Function
   */
  itemRender: Function,
};
