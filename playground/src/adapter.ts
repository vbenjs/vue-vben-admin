import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';

import {
  Checkbox,
  CheckboxGroup,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  Radio,
  RadioGroup,
  Rate,
  Select,
  Switch,
} from 'ant-design-vue';

// 业务表单组件适配

export type FormComponentType =
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'Radio'
  | 'RadioGroup'
  | 'Rate'
  | 'Select'
  | 'Switch'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    Checkbox,
    CheckboxGroup,
    Input,
    InputNumber,
    InputPassword,
    Mentions,
    Radio,
    RadioGroup,
    Rate,
    Select,
    Switch,
  },
  config: {
    modelPropName: 'value',
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
