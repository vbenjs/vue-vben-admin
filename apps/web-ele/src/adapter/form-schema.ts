import type {
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  ElTimePicker,
  ElTreeSelect,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  SelectV2Props,
  SpaceProps,
  SwitchProps,
  UploadProps,
} from 'element-plus';

import type { Component } from 'vue';

import type {
  ApiComponentSharedProps,
  VbenFormSchema as CoreFormSchema,
  FormActions,
  IconPickerProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

type ElTreeSelectSchemaProps = InstanceType<typeof ElTreeSelect>['$props'];
type ElTimePickerSchemaProps = InstanceType<typeof ElTimePicker>['$props'];

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
  ApiSelect: ApiComponentSharedProps & SelectV2Props;
  ApiTreeSelect: ApiComponentSharedProps & ElTreeSelectSchemaProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  Divider: DividerProps;
  IconPicker: IconPickerProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  RadioGroup: RadioGroupProps;
  Select: SelectV2Props;
  Space: SpaceProps;
  Switch: SwitchProps;
  TimePicker: ElTimePickerSchemaProps;
  TreeSelect: ElTreeSelectSchemaProps;
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
