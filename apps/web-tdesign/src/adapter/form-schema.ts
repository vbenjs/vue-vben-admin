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
  FormActions,
  IconPickerProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

type ComponentProps<P> =
  | ((
      value: Partial<Record<string, any>>,
      actions: FormActions,
    ) => P & Record<string, any>)
  | (P & Record<string, any>);

/**
 * 与 {@link ComponentType} 中注册的组件名一一对应，便于 Schema 上 `component` + `componentProps` 联动提示
 */
interface ComponentPropsMap {
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

type RegisteredName = keyof ComponentPropsMap;

type DiscriminatedFormSchema = {
  [K in RegisteredName]: BaseSchema & {
    component: K;
    componentProps?: ComponentProps<ComponentPropsMap[K]>;
  };
}[RegisteredName];

type FallbackFormSchema = BaseSchema & {
  component: Component | Exclude<ComponentType, RegisteredName>;
  componentProps?: CoreFormSchema<ComponentType>['componentProps'];
};

export type VbenFormSchema = DiscriminatedFormSchema | FallbackFormSchema;
