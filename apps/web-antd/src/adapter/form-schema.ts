import type {
  AutoCompleteProps,
  ButtonProps,
  CascaderProps,
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  MentionsProps,
  RadioGroupProps,
  RadioProps,
  RateProps,
  SelectProps,
  SpaceProps,
  SwitchProps,
  TextAreaProps,
  TimePickerProps,
  TreeSelectProps,
  UploadProps,
} from 'ant-design-vue';
import type { RangePickerProps } from 'ant-design-vue/es/date-picker';

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
  ApiCascader: ApiComponentSharedProps & CascaderProps;
  ApiSelect: ApiComponentSharedProps & SelectProps;
  ApiTreeSelect: ApiComponentSharedProps & TreeSelectProps;
  AutoComplete: AutoCompleteProps;
  Cascader: CascaderProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  DefaultButton: ButtonProps;
  Divider: DividerProps;
  IconPicker: IconPickerProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  InputPassword: InputProps;
  Mentions: MentionsProps;
  PrimaryButton: ButtonProps;
  Radio: RadioProps;
  RadioGroup: RadioGroupProps;
  RangePicker: RangePickerProps;
  Rate: RateProps;
  Select: SelectProps;
  Space: SpaceProps;
  Switch: SwitchProps;
  Textarea: TextAreaProps;
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
