import type {
  CheckboxGroupProps,
  CheckboxProps,
  DatePickerProps,
  DividerProps,
  InputNumberProps,
  InputProps,
  RadioGroupProps,
  SelectProps,
  SpaceProps,
  SwitchProps,
  TimePickerProps,
  TreeSelectProps,
  UploadProps,
} from 'naive-ui';

import type { Component } from 'vue';

import type {
  ApiComponentSharedProps,
  VbenFormSchema as CoreFormSchema,
  IconPickerProps,
} from '@vben/common-ui';

import type { ComponentType } from './component';

type ComponentPropsFnArgs = Parameters<
  Extract<
    NonNullable<CoreFormSchema<ComponentType>['componentProps']>,
    (...args: any) => any
  >
>;

/**
 * 使用适配器里为各 `component` 声明的 Props 类型 `P`；
 * 与 `Record<string, any>` 相交以兼容核心库 `MaybeComponentProps` 的索引签名。
 */
type ComponentProps<P> =
  | ((
      value: ComponentPropsFnArgs[0],
      actions: ComponentPropsFnArgs[1],
    ) => P & Record<string, any>)
  | (P & Record<string, any>);

/**
 * 与 {@link ComponentType} 中注册的组件名一一对应，便于 Schema 上 `component` + `componentProps` 联动提示
 */
interface ComponentPropsMap {
  ApiSelect: ApiComponentSharedProps & SelectProps;
  ApiTreeSelect: ApiComponentSharedProps & TreeSelectProps;
  Checkbox: CheckboxProps;
  CheckboxGroup: CheckboxGroupProps;
  DatePicker: DatePickerProps;
  Divider: DividerProps;
  IconPicker: IconPickerProps;
  Input: InputProps;
  InputNumber: InputNumberProps;
  RadioGroup: RadioGroupProps;
  Select: SelectProps;
  Space: SpaceProps;
  Switch: SwitchProps;
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
