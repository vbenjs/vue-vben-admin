import type { InjectionKey, Ref } from 'vue';

export interface FormFieldContext {
  dirty: Readonly<Ref<boolean>>;
  error: Readonly<Ref<string | undefined>>;
  name: Readonly<Ref<string>>;
  touched: Readonly<Ref<boolean>>;
  valid: Readonly<Ref<boolean>>;
}

export const FORM_ITEM_INJECTION_KEY = Symbol() as InjectionKey<string>;
export const FORM_FIELD_INJECTION_KEY =
  Symbol() as InjectionKey<FormFieldContext>;
