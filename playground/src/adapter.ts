import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';

import { Input, InputPassword, Select } from 'ant-design-vue';

// 业务表单组件适配

export type FormComponentType =
  | 'Input'
  | 'InputPassword'
  | 'Select'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    Input,
    InputPassword,
    Select,
  },
  config: {
    modelPropName: 'value',
  },
});

const useVbenForm = useForm<FormComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<FormComponentType>;
export type { VbenFormProps };
