import type {
  VbenFormProps as FormProps,
  VbenFormSchema as FormSchema,
  FormValues,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { initComponentAdapter } from './component';

initComponentAdapter();

setupVbenForm<ComponentType>({
  config: {
    baseModelPropName: 'value',
    // naive-ui组件的空值为null,不能是undefined，否则重置表单时不生效
    emptyStateValue: null,
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  rules: {
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

function useVbenForm<
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
>(
  options: FormProps<
    ComponentType,
    Record<never, never>,
    TFormValues,
    TSubmitValues
  >,
) {
  return useForm<
    TFormValues,
    ComponentType,
    Record<never, never>,
    TSubmitValues
  >(options);
}

export { useVbenForm, z };

export type VbenFormSchema<TValues extends FormValues = FormValues> =
  FormSchema<ComponentType, Record<never, never>, TValues>;
export type VbenFormProps<
  TFormValues extends FormValues = FormValues,
  TSubmitValues extends FormValues = TFormValues,
> = FormProps<ComponentType, Record<never, never>, TFormValues, TSubmitValues>;
