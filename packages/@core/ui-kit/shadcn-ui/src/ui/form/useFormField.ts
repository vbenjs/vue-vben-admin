import { computed, inject } from 'vue';

import {
  FORM_FIELD_INJECTION_KEY,
  FORM_ITEM_INJECTION_KEY,
} from './injectionKeys';

export function useFormField() {
  const fieldContext = inject(FORM_FIELD_INJECTION_KEY);
  const fieldItemContext = inject(FORM_ITEM_INJECTION_KEY);

  if (!fieldContext)
    throw new Error('useFormField should be used within <FormField>');
  if (!fieldItemContext)
    throw new Error('useFormField should be used within <FormItem>');

  const { dirty, error, name, touched, valid } = fieldContext;
  const id = fieldItemContext;

  const fieldState = {
    valid: computed(() => valid.value),
    isDirty: computed(() => dirty.value),
    isTouched: computed(() => touched.value),
    error,
  };

  return {
    id,
    name,
    formItemId: `${id}-form-item`,
    formDescriptionId: `${id}-form-item-description`,
    formMessageId: `${id}-form-item-message`,
    ...fieldState,
  };
}
