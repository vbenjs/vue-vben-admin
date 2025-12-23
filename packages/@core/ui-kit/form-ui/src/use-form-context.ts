import type { ComputedRef } from 'vue';

import type { ExtendedFormApi, FormActions, VbenFormProps } from './types';

import { computed, unref, useSlots } from 'vue';

import { createContext } from '@vben-core/shadcn-ui';
import { isString, set } from '@vben-core/shared/utils';

import { useForm } from 'vee-validate';

import { getCustomDefaultValue_byZodSchema } from './form-render/helper';

type ExtendFormProps = VbenFormProps & { formApi?: ExtendedFormApi };

export const [injectFormProps, provideFormProps] =
  createContext<[ComputedRef<ExtendFormProps> | ExtendFormProps, FormActions]>(
    'VbenFormProps',
  );

export const [injectComponentRefMap, provideComponentRefMap] =
  createContext<Map<string, unknown>>('ComponentRefMap');

export function useFormInitial(
  props: ComputedRef<VbenFormProps> | VbenFormProps,
) {
  const slots = useSlots();
  const initialValues = generateInitialValues();

  const form = useForm({
    ...(Object.keys(initialValues)?.length ? { initialValues } : {}),
  });

  const delegatedSlots = computed(() => {
    const resultSlots: string[] = [];

    for (const key of Object.keys(slots)) {
      if (key !== 'default') {
        resultSlots.push(key);
      }
    }
    return resultSlots;
  });

  function generateInitialValues() {
    const initialValues: Record<string, any> = {};

    (unref(props).schema || []).forEach((item) => {
      if ('defaultValue' in item) {
        set(initialValues, item.fieldName, item.defaultValue);
      } else if (item.rules && !isString(item.rules)) {
        const zodSchema = item.rules;

        // 检查规则是否适合提取默认值
        const customDefaultValue = getCustomDefaultValue_byZodSchema(zodSchema);
        if (customDefaultValue !== undefined) {
          set(initialValues, item.fieldName, customDefaultValue);
        }
      }
    });

    return initialValues;
  }

  return {
    delegatedSlots,
    form,
  };
}
