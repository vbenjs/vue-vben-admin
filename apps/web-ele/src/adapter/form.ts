import type { VbenFormProps as CoreFormProps } from '@vben/common-ui';

import type { ComponentType } from './component';
import type { VbenFormSchema } from './form-schema';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

async function initSetupVbenForm() {
  setupVbenForm<ComponentType>({
    config: {
      modelPropNameMap: {
        Upload: 'fileList',
        CheckboxGroup: 'model-value',
      },
    },
    defineRules: {
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
}

type VbenFormProps = Omit<CoreFormProps<ComponentType>, 'schema'> & {
  schema?: VbenFormSchema[];
};

function useVbenForm(options: VbenFormProps) {
  return useForm<ComponentType>(options as CoreFormProps<ComponentType>);
}

export { initSetupVbenForm, useVbenForm, z };

export type { VbenFormProps, VbenFormSchema };
