import type {
  BaseFormComponentType,
  VbenFormSchema as FormSchema,
  VbenFormProps,
} from '@vben/common-ui';

import { h } from 'vue';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import {
  NButton,
  NCheckbox,
  NCheckboxGroup,
  NDatePicker,
  NDivider,
  NInput,
  NInputNumber,
  NRadioGroup,
  NSelect,
  NSpace,
  NSwitch,
  NTimePicker,
  NTreeSelect,
  NUpload,
} from 'naive-ui';
// 业务表单组件适配

export type FormComponentType =
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'RadioGroup'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

// 初始化表单组件，并注册到form组件内部
setupVbenForm<FormComponentType>({
  components: {
    Checkbox: NCheckbox,
    CheckboxGroup: NCheckboxGroup,
    DatePicker: NDatePicker,
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
    Divider: NDivider,
    Input: NInput,
    InputNumber: NInputNumber,
    RadioGroup: NRadioGroup,
    Select: NSelect,
    Space: NSpace,
    Switch: NSwitch,
    TimePicker: NTimePicker,
    TreeSelect: NTreeSelect,
    Upload: NUpload,
  },
  config: {
    baseModelPropName: 'value',
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Upload: 'fileList',
    },
  },
  defineRules: {
    required: (value, _params, ctx) => {
      if ((!value && value !== 0) || value.length === 0) {
        return $t('formRules.required', [ctx.label]);
      }
      return true;
    },
  },
});

const useVbenForm = useForm<FormComponentType>;

export { useVbenForm, z };

export type VbenFormSchema = FormSchema<FormComponentType>;
export type { VbenFormProps };
