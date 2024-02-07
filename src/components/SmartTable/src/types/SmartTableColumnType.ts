import type { VxeTableDefines, VxeColumnSlotTypes, VxeColumnPropTypes } from 'vxe-table';
import { VxeTableConstructor, VxeTablePrivateMethods } from 'vxe-table/types/table';

export type SmartTableColumnComponent = 'switch' | 'tag' | 'button' | 'booleanTag' | 'useYnTag';

export type SmartEditRenderName =
  | 'AInput'
  | 'AAutocomplete'
  | 'AInputNumber'
  | 'ASelect'
  | 'ACascader'
  | 'ADatePicker'
  | 'AMonthPicker'
  | 'ARangePicker'
  | 'AWeekPicker'
  | 'ATimePicker'
  | 'ATreeSelect'
  | 'ASwitch'
  | 'ARate'
  | 'AButton'
  | 'AButtons'
  | 'input'
  | 'textarea'
  | 'select'
  | '$input'
  | '$select'
  | '$switch';

// @ts-ignore
export interface SmartEditRender extends VxeColumnPropTypes.EditRender {
  autofocus?: boolean | string;
  name?: SmartEditRenderName;
  // 是否阻止回车键事件冒泡，组织后回车不会调到下一行，默认true
  stopEnterBubbling?: boolean;
  // 是否必填
  required?: boolean;
  // 校验规则
  rules?: VxeTableDefines.ValidatorRule[];
}

export type SmartColumnDynamicClass =
  | string
  | ((params: {
      $table: VxeTableConstructor & VxeTablePrivateMethods;
      row: any;
      rowIndex: number;
      $rowIndex: number;
      _rowIndex: number;
      column: VxeTableDefines.ColumnInfo;
      columnIndex: number;
      $columnIndex: number;
      _columnIndex: number;
    }) => void | null | string | { [key: string]: boolean });

export type SmartColumnDynamicStyle =
  | any
  | ((params: {
      $table: VxeTableConstructor & VxeTablePrivateMethods;
      row: any;
      rowIndex: number;
      $rowIndex: number;
      _rowIndex: number;
      column: VxeTableDefines.ColumnInfo;
      columnIndex: number;
      $columnIndex: number;
      _columnIndex: number;
    }) => void | null | string | { [key: string]: boolean });

export type SmartColumnAutoClass = 'Boolean';

// @ts-ignore
export interface SmartColumn extends VxeTableDefines.ColumnOptions {
  flag?: 'INDEX' | 'DEFAULT' | 'CHECKBOX' | 'RADIO' | 'ACTION';
  component?: SmartTableColumnComponent;
  componentProps?: Recordable | ((params: VxeColumnSlotTypes.DefaultSlotParams) => Recordable);
  editRender?: SmartEditRender;
  // 动态CLASS
  dynamicClass?: SmartColumnDynamicClass;
  // 动态style
  dynamicStyle?: SmartColumnDynamicStyle;
  // 自动class
  autoClass?: SmartColumnAutoClass;
}
