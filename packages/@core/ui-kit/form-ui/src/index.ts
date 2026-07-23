export { setupVbenForm } from './config';
export { FormCodecError } from './form-codec';

export type { FormCodecPhase } from './form-codec';

export type {
  BaseFormComponentType,
  ExtendedFormApi,
  FormActions,
  FormCodec,
  FormContextApi,
  FormLayout,
  FormSchemaContext,
  FormValues,
  FormValueSnapshot,
  VbenFormActionSlotProps,
  VbenFormComponent,
  VbenFormDefaultSlotProps,
  VbenFormFieldArrayProps,
  VbenFormFieldSlotProps,
  VbenFormProps,
  FormSchema as VbenFormSchema,
  VbenFormSlots,
} from './types';

export * from './use-vben-form';
// export { default as VbenForm } from './vben-form.vue';
export * as z from 'zod';
