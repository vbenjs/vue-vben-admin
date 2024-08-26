import type { VxeGridPropTypes } from 'vxe-pc-ui';
import type { VxeGridProps, VxeTableEvents } from 'vxe-table';

export interface VbenTableProps extends VxeGridProps {
  afterFetch?: any;
  api?: any;
  pagination?: boolean | VxeGridPropTypes.PagerConfig;
  params?: object;
  title?: string;
}

export type VbenColumns = VxeGridPropTypes.Columns;

export type VbenCellClick = VxeTableEvents.CellClick;
