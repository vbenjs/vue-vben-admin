export interface PaginationProps {
  /**
   * 是否禁用
   */
  disabled?: boolean;
  /**
   * 每页记录数选项
   */
  pageSizeOptions?: number[];
  /**
   * 当 时true，始终显示第一页、最后一页和省略号
   */
  showEdges?: boolean;
  /**
   * 显示当前页选择下拉框
   */
  showRowsPerPage?: boolean;
  /**
   * 显示总条数文本
   */
  showTotalText?: boolean;
  /**
   * 当前页面周围应显示的兄弟页面数量
   */
  siblingCount?: number;
  /**
   * 组件尺寸
   */
  size?: 'default' | 'large' | 'small';

  /**
   * 总条数
   */
  total?: number;
}

export const SIZE_CLASS_MAP = {
  default: 'size-8',
  large: 'size-9',
  small: 'size-7',
};
