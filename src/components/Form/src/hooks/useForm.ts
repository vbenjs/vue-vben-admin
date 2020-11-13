import { ref, onUnmounted, unref } from 'vue';

import { isInSetup } from '/@/utils/helper/vueHelper';
import { isProdMode } from '/@/utils/env';

import type { FormProps, FormActionType, UseFormReturnType, FormSchema } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';

export declare type ValidateFields = (nameList?: NamePath[]) => Promise<any>;

export function useForm(props?: Partial<FormProps>): UseFormReturnType {
  isInSetup();
  const formRef = ref<FormActionType | null>(null);
  const loadedRef = ref<boolean | null>(false);

  function getForm() {
    const form = unref(formRef);
    if (!form) {
      throw new Error('formRef is Null');
    }
    return form as FormActionType;
  }
  function register(instance: FormActionType) {
    isProdMode() &&
      onUnmounted(() => {
        formRef.value = null;
        loadedRef.value = null;
      });
    if (unref(loadedRef) && isProdMode() && instance === unref(formRef)) return;
    formRef.value = instance;
    props && instance.setProps(props);
    loadedRef.value = true;
  }

  const methods: FormActionType = {
    setProps: (formProps: Partial<FormProps>) => {
      getForm().setProps(formProps);
    },
    updateSchema: (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      getForm().updateSchema(data);
    },
    clearValidate: (name?: string | string[]) => {
      getForm().clearValidate(name);
    },
    resetFields: async () => {
      await getForm().resetFields();
    },
    removeSchemaByFiled: (field: string | string[]) => {
      getForm().removeSchemaByFiled(field);
    },
    getFieldsValue: () => {
      return getForm().getFieldsValue();
    },
    setFieldsValue: <T>(values: T) => {
      getForm().setFieldsValue<T>(values);
    },
    appendSchemaByField: (schema: FormSchema, prefixField?: string | undefined) => {
      getForm().appendSchemaByField(schema, prefixField);
    },
    submit: async (): Promise<any> => {
      return getForm().submit();
    },
    validate: ((async (nameList?: NamePath[]): Promise<any> => {
      return getForm().validate(nameList);
    }) as any) as ValidateFields,
    validateFields: ((async (nameList?: NamePath[]): Promise<any> => {
      return getForm().validate(nameList);
    }) as any) as ValidateFields,
  } as FormActionType;
  return [register, methods];
}
