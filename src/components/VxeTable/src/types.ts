import { CSSProperties } from 'vue';
import { VxeGridProps } from 'vxe-table';

export type BasicTableProps = VxeGridProps & {
  tableClass?: string;
  tableStyle?: CSSProperties;
};
