import type {
  FormProps,
  FormActionType,
  UseFormReturnType,
  FormSchemaInner as FormSchema,
} from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import type { DynamicProps } from '#/utils';
import { ref, onUnmounted, unref, nextTick, watch } from 'vue';
import { isProdMode } from '@/utils/env';
import { error } from '@/utils/log';
import { getDynamicProps } from '@/utils';

export declare type ValidateFields = (nameList?: NamePath[]) => Promise<Recordable>;

type Props = Partial<DynamicProps<FormProps>>;

export function useForm(props?: Props): UseFormReturnType {
  const formRef = ref<Nullable<FormActionType>>(null);
  const loadedRef = ref<Nullable<boolean>>(false);

  async function getForm() {
    const form = unref(formRef);
    if (!form) {
      error(
        'The form instance has not been obtained, please make sure that the form has been rendered when performing the form operation!',
      );
    }
    await nextTick();
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
    loadedRef.value = true;

    watch(
      () => props,
      () => {
        props && instance.setProps(getDynamicProps(props));
      },
      {
        immediate: true,
        deep: true,
      },
    );
  }

  const methods: FormActionType = {
    scrollToField: async (name: NamePath, options?: ScrollOptions | undefined) => {
      const form = await getForm();
      form.scrollToField(name, options);
    },
    setProps: async (formProps: Partial<FormProps>) => {
      const form = await getForm();
      form.setProps(formProps);
    },

    updateSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.updateSchema(data);
    },

    resetSchema: async (data: Partial<FormSchema> | Partial<FormSchema>[]) => {
      const form = await getForm();
      form.resetSchema(data);
    },

    clearValidate: async (name?: string | string[]) => {
      const form = await getForm();
      form.clearValidate(name);
    },

    resetFields: () => {
      // 修复表单重置后，页面变化了，但是由于异步问题导致表单内部的状态没有及时同步
      return new Promise((resolve) => {
        getForm().then(async (form) => {
          await form.resetFields();
          resolve();
        });
      });
    },

    removeSchemaByField: async (field: string | string[]) => {
      unref(formRef)?.removeSchemaByField(field);
    },

    // TODO promisify
    getFieldsValue: <T>() => {
      return unref(formRef)?.getFieldsValue() as T;
    },

    setFieldsValue: async <T extends Recordable<any>>(values: T) => {
      const form = await getForm();
      form.setFieldsValue(values);
    },

    appendSchemaByField: async (
      schema: FormSchema | FormSchema[],
      prefixField: string | undefined,
      first?: boolean,
    ) => {
      const form = await getForm();
      form.appendSchemaByField(schema, prefixField, first);
    },

    submit: async (): Promise<any> => {
      const form = await getForm();
      return form.submit();
    },

    validate: async <T = Recordable>(nameList?: NamePath[] | false): Promise<T> => {
      const form = await getForm();
      return form.validate(nameList);
    },

    validateFields: async (nameList?: NamePath[]): Promise<Recordable> => {
      const form = await getForm();
      return form.validateFields(nameList);
    },
    resetDefaultField: async (nameList?: NamePath[]) => {
      unref(formRef)?.resetDefaultField(nameList);
    },
  };

  return [register, methods];
}
