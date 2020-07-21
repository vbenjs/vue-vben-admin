import { PaginationProps } from './pagination';

export interface Scroll {
  x: number | boolean;
  y: number;
  scrollToFirstRowOnChange: boolean;
}
export interface BasicTableProps {
  // 是否可以自适应高度
  canResize?: boolean;
  // 自适应高度偏移， 计算结果-偏移量
  resizeHeightOffset?: number;

  // 表格滚动最大高度
  maxHeight?: number;

  bordered?: boolean;
  pagination?: PaginationProps | false;
  loading?: boolean;
  scroll?: Scroll;
}
