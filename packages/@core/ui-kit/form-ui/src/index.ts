export { setupVbenForm } from './config';
export { FormCodecError } from './form-codec';

export type { FormCodecPhase } from './form-codec';

export type {
  BaseFormComponentType,
  ExtendedFormApi,
  FormActions,
  FormCodec,
  FormContextApi,
  FormGroupSchema,
  FormLayout,
  FormSchemaContext,
  FormValues,
  FormValueSnapshot,
  VbenFormActionSlotProps,
  VbenFormComponent,
  VbenFormDefaultSlotProps,
  VbenFormFieldArrayProps,
  FormFieldSchema as VbenFormFieldSchema,
  VbenFormFieldSlotProps,
  FormGroupSchema as VbenFormGroupSchema,
  VbenFormProps,
  VbenFormResolvedComponentProps,
  FormSchema as VbenFormSchema,
  VbenFormSlots,
} from './types';

export { useCustomFieldValue } from './use-custom-field-value';

export type {
  UseCustomFieldValueOptions,
  UseCustomFieldValueReturn,
} from './use-custom-field-value';

export * from './use-vben-form';
// export { default as VbenForm } from './vben-form.vue';
export * as z from 'zod';
