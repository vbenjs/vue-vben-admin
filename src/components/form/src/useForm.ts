import { ref, getCurrentInstance, Ref, onUnmounted, unref } from 'compatible-vue';
import { isProdMode } from '@/utils/envUtil';
// import { isFunction } from '@/utils/is/index';

import {
  FormProps,
  FormInstance,
  UseFormReturnType,
  ValidateResult,
  FormSchema,
} from './types/form';

export function useForm(props?: Partial<FormProps>): UseFormReturnType {
  if (!getCurrentInstance()) {
    throw new Error('Please put useForm function in the setup function!');
  }
  const formRef = ref<FormInstance | null>(null);
  const loadedRef = ref<boolean | null>(false);

  function getForm(instance: FormInstance) {
    onUnmounted(() => {
      formRef.value = null;
      loadedRef.value = null;
    });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) {
      return;
    }
    formRef.value = instance;
    props && instance.setProps(props);
    loadedRef.value = true;
  }
  const methods: FormInstance & {
    formRef: Ref<FormInstance>;
  } = {
    setFieldsValue: <T>(values: T): void => {
      unref(formRef)?.setFieldsValue(values);
    },
    resetFields: async (): Promise<any> => {
      const res = await unref(formRef)!.resetFields();
      return res;
    },
    validateFieldsAndScroll: async <T>(): Promise<ValidateResult<T>> => {
      const res = unref(formRef)!.validateFieldsAndScroll<T>();
      return res;
    },
    validateFields: async <T>(): Promise<ValidateResult<T>> => {
      const res = unref(formRef)!.validateFields<T>();
      return res;
    },
    updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]): void => {
      unref(formRef)?.updateSchema(data);
    },
    setProps: (formProps: Partial<FormProps>): void => {
      unref(formRef)?.setProps(formProps);
    },
    getFieldsValue: (): { [field: string]: any } => {
      return unref(formRef)!.getFieldsValue!();
    },
    removeSchemaByFiled: (field: string | string[]): void => {
      return unref(formRef)!.removeSchemaByFiled(field);
    },
    appendSchemaByField: (schema: FormSchema, prefixField?: string): void => {
      return unref(formRef)!.appendSchemaByField(schema, prefixField);
    },
    formRef: formRef as Ref<FormInstance>,
  };
  return [getForm, methods];
}
