import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';

import {
  AutoComplete,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Switch,
  TimePicker,
  TreeSelect,
} from 'ant-design-vue';

// 业务表单组件适配

export type FormComponentType =
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    Input,
    InputNumber,
    InputPassword,
    Mentions,
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select,
    Switch,
    TimePicker,
    TreeSelect,
  },
  config: {
    baseModelPropName: 'value',
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
    },
  },
});

const useVbenForm = useForm<FormComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<FormComponentType>;
export type { VbenFormProps };
