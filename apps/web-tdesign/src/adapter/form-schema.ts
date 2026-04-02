import type {
  AutoCompleteProps,
  ButtonProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DateRangePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  RadioProps,
  SelectProps,
  SpaceProps,
  SwitchProps,
  TextareaProps,
  TimePickerProps,
  TreeSelectProps,
} from 'tdesign-vue-next';
import type { TdRateProps } from 'tdesign-vue-next/es/rate/type';
import type { UploadProps } from 'tdesign-vue-next/es/upload/types';

import type { Component } from 'vue';

import type {
  ApiComponentSharedProps,
  VbenFormSchema as CoreFormSchema,
  IconPickerProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

/**
 * 对象形式：使用适配器里为各 `component` 声明的 Props 类型 `P`；
 * 与 `Record<string, any>` 相交是为了满足核心库 `MaybeComponentProps` 的索引签名。
 * 函数形式：通过联合 `CoreFormSchema['componentProps']`，与表单核心对动态 `componentProps` 的约定保持一致。
 */
type SchemaComponentProps<P> =
  | CoreFormSchema<ComponentType>['componentProps']
  | (P & Record<string, any>);

/**
 * 与 {@link ComponentType} 中注册的组件名一一对应，便于 Schema 上 `component` + `componentProps` 联动提示
 */
interface FormSchemaComponentPropsMap {
  ApiSelect: ApiComponentSharedProps & SelectProps;
  ApiTreeSelect: ApiComponentSharedProps & TreeSelectProps;
  AutoComplete: AutoCompleteProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  DefaultButton: ButtonProps;
  Divider: DividerProps;
  IconPicker: IconPickerProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  PrimaryButton: ButtonProps;
  Radio: RadioProps;
  RadioGroup: RadioGroupProps;
  RangePicker: DateRangePickerProps;
  Rate: TdRateProps;
  Select: SelectProps;
  Space: SpaceProps;
  Switch: SwitchProps;
  Textarea: TextareaProps;
  TimePicker: TimePickerProps;
  TreeSelect: TreeSelectProps;
  Upload: UploadProps;
}

type BaseSchema = Omit<
  CoreFormSchema<ComponentType>,
  'component' | 'componentProps'
>;

type RegisteredName = keyof FormSchemaComponentPropsMap;

type DiscriminatedFormSchema = {
  [K in RegisteredName]: BaseSchema & {
    component: K;
    componentProps?: SchemaComponentProps<FormSchemaComponentPropsMap[K]>;
  };
}[RegisteredName];

type FallbackFormSchema = BaseSchema & {
  component: Component | Exclude<ComponentType, RegisteredName>;
  componentProps?: CoreFormSchema<ComponentType>['componentProps'];
};

export type VbenFormSchema = DiscriminatedFormSchema | FallbackFormSchema;
