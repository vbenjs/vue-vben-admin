import type {
  BaseFormComponentType,
  ExtendedFormApi,
  FormValues,
  VbenFormComponent,
  VbenFormProps,
} from './types';

import { defineComponent, h, isReactive, onBeforeUnmount, watch } from 'vue';

import { useSelector } from '@vben-core/shared/store';

import { FormApi } from './form-api';
import VbenUseForm from './vben-use-form.vue';

type UseVbenFormReturn<
  TValues extends FormValues,
  T extends BaseFormComponentType,
  P extends Record<string, any>,
  TSubmitValues extends FormValues = TValues,
> = readonly [
  VbenFormComponent<TValues, T, P, TSubmitValues>,
  ExtendedFormApi<TValues, T, P, TSubmitValues>,
];

export function useVbenForm<
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
>(options: VbenFormProps<T, P>): UseVbenFormReturn<FormValues, T, P>;

export function useVbenForm<
  TValues extends FormValues,
  T extends BaseFormComponentType = BaseFormComponentType,
  P extends Record<string, any> = Record<never, never>,
  TSubmitValues extends FormValues = TValues,
>(
  options: VbenFormProps<T, P, TValues, TSubmitValues>,
): UseVbenFormReturn<TValues, T, P, TSubmitValues>;

export function useVbenForm(
  options: VbenFormProps<any, any, any, any>,
): UseVbenFormReturn<any, any, any, any> {
  const IS_REACTIVE = isReactive(options);
  const api = new FormApi<any, any, any, any>(options);
  const extendedApi = api as ExtendedFormApi<any, any, any, any>;
  extendedApi.useStore = (selector: any) => {
    return useSelector(api.store, selector);
  };

  const Form = defineComponent(
    (props: VbenFormProps, { attrs, slots }) => {
      onBeforeUnmount(() => {
        api.unmount();
      });
      api.setState({ ...props, ...attrs });
      return () =>
        h(VbenUseForm, { ...props, ...attrs, formApi: extendedApi }, slots);
    },
    {
      name: 'VbenUseForm',
      inheritAttrs: false,
    },
  );
  // Add reactivity support
  if (IS_REACTIVE) {
    watch(
      () => options.schema,
      () => {
        api.setState({ schema: options.schema });
      },
      { immediate: true },
    );
  }

  return [Form, extendedApi] as unknown as UseVbenFormReturn<
    any,
    any,
    any,
    any
  >;
}
