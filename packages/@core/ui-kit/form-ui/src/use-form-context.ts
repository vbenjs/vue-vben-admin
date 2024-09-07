import type { FormActions, VbenFormProps } from './types';

import { computed, type ComputedRef, unref, useSlots } from 'vue';

import { createContext } from '@vben-core/shadcn-ui';

import { useForm } from 'vee-validate';
import { object, type ZodRawShape } from 'zod';
import { getDefaultsForSchema } from 'zod-defaults';

export const [injectFormProps, provideFormProps] =
  createContext<[ComputedRef<VbenFormProps> | VbenFormProps, FormActions]>(
    'VbenFormProps',
  );

export function useFormInitial(
  props: ComputedRef<VbenFormProps> | VbenFormProps,
) {
  const slots = useSlots();
  const form = useForm({
    // 设置默认值
    initialValues: getDefaultsForSchema(composeZodObjectSchema()),
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

  /**
   * 将表单的 schema 转换为 zod object schema
   */
  function composeZodObjectSchema() {
    const zodObject: ZodRawShape = {};
    (unref(props).schema || []).forEach((item) => {
      if (item.rules) {
        zodObject[item.fieldName] = item.rules;
      }
    });
    return object(zodObject);
  }

  return {
    delegatedSlots,
    form,
  };
}
