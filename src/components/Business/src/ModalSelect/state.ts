import { FormSchema, FormProps } from '@/components/Form';
import { BasicColumn } from '@/components/Table';

export type OptionsItem = { label: string; value: string; disabled?: boolean };

export interface SelectModalProps {
  api?: ((...arg) => Promise<OptionsItem[]>) | null;
  title?: string;
  onOK?: Fn;
  width?: string;
  rowKey?: string;
  formConfig?: FormProps;
  multiple?: boolean;
  columns?: BasicColumn[];
  schema?: FormSchema[];
}

export interface SelectProps extends SelectModalProps {
  getMissingItem?: ((...arg) => Promise<OptionsItem>) | null;
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
  formatter?: <T extends OptionsItem>(item: T) => string;
}
