import { FormSchema, FormProps } from '@/components/Form';
import { BasicColumn } from '@/components/Table';

export type OptionsItem = { label?: string; value?: string; disabled?: boolean };

export interface SelectTableProps<T = Recordable> {
  api?: ((...arg) => Promise<(OptionsItem & T)[]>) | null;
  title?: string;
  onOK?: (rows: T[]) => void;
  width?: string;
  rowKey?: string;
  formConfig?: FormProps;
  multiple?: boolean;
  columns: BasicColumn[];
  schemas?: FormSchema[];
}

export interface SelectProps<T = Recordable> extends SelectTableProps<T> {
  getMissingItem?: ((...arg) => Promise<OptionsItem & T>) | null;
  params?: Recordable;
  resultField?: string;
  labelField?: string;
  valueField?: string;
  searchField?: string;
  immediate?: boolean;
  alwaysLoad?: boolean;
  formLabelName?: string;
  showOptionNumber?: number;
  numberToString?: boolean;
  value?: any;
  formatter?: (item: T) => string;
}
