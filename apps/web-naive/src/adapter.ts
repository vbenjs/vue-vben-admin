import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { h } from 'vue';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';

import {
  NButton,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NInput,
  NInputNumber,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTreeSelect,
  NUpload,
} from 'naive-ui';
// 业务表单组件适配

export type FormComponentType =
  | 'Input'
  | 'InputPassword'
  | 'Select'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    // 自定义默认的重置按钮
    DefaultResetActionButton: (props, { attrs, slots }) => {
      return h(NButton, { ...props, attrs, text: false, type: 'info' }, slots);
    },
    // 自定义默认的提交按钮
    DefaultSubmitActionButton: (props, { attrs, slots }) => {
      return h(
        NButton,
        { ...props, attrs, text: false, type: 'primary' },
        slots,
      );
    },
    NCheckboxGroup,
    NDatePicker,
    NDivider,
    NInput,
    NInputNumber,
    NRadioGroup,
    NSelect,
    NSpace,
    NSwitch,
    NTreeSelect,
    NUpload,
  },
  config: {
    baseModelPropName: 'value',
    modelPropNameMap: {
      NUpload: 'fileList',
    },
  },
});

const useVbenForm = useForm<FormComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<FormComponentType>;
export type { VbenFormProps };
