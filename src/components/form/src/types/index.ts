import { VNode } from 'compatible-vue';
import { Col } from 'ant-design-vue';

export interface ColEx extends Col {
  style: object;
}

export type SlotType = { [key: string]: (...args: any[]) => VNode[] };
export type ComponentType =
  | 'Input'
  | 'InputGroup'
  | 'InputPassword'
  | 'InputSearch'
  | 'InputTextArea'
  | 'InputNumber'
  | 'InputCountDown'
  | 'Select'
  | 'DictSelect'
  | 'SelectOptGroup'
  | 'SelectOption'
  | 'TreeSelect'
  | 'Transfer'
  | 'Radio'
  | 'RadioButton'
  | 'RadioGroup'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'AutoComplete'
  | 'Cascader'
  | 'DatePicker'
  | 'MonthPicker'
  | 'RangePicker'
  | 'WeekPicker'
  | 'TimePicker'
  | 'ImageUpload'
  | 'Switch';
