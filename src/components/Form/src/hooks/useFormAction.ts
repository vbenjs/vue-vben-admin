import type { ComputedRef, Ref } from 'vue';
import type { FormProps, FormSchema, FormActionType } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';

import { unref, toRaw } from 'vue';

import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import { deepMerge, unique } from '/@/utils';
import { dateItemType } from '../helper';
import moment from 'moment';
import { cloneDeep } from 'lodash-es';

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: any;
  defaultValueRef: Ref<any>;
  formElRef: Ref<FormActionType>;
  schemaRef: Ref<FormSchema[]>;
  handleFormValues: Fn;
  actionState: {
    resetAction: any;
    submitAction: any;
  };
}
export function useFormAction({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
  actionState,
}: UseFormActionContext) {
  async function resetFields(): Promise<any> {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());
    const formEl = unref(formElRef);
    if (!formEl) return;
    Object.keys(formModel).forEach((key) => {
      (formModel as any)[key] = defaultValueRef.value[key];
    });
    clearValidate();
    emit('reset', toRaw(formModel));
    // return values;
    submitOnReset && handleSubmit();
  }

  /**
   * @description: 设置表单值
   */
  async function setFieldsValue(values: any): Promise<void> {
    const fields = unref(getSchema)
      .map((item) => item.field)
      .filter(Boolean);
    // const formEl = unref(formElRef);

    const validKeys: string[] = [];
    Object.keys(values).forEach((key) => {
      const element = values[key];
      if (element !== undefined && element !== null && fields.includes(key)) {
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(element)) {
            const arr: any[] = [];
            for (const ele of element) {
              arr.push(moment(ele));
            }
            (formModel as any)[key] = arr;
          } else {
            (formModel as any)[key] = moment(element);
          }
        } else {
          (formModel as any)[key] = element;
        }
        validKeys.push(key);
      }
    });
    // if (formEl) {
    //   formEl.validateFields(validKeys);
    // }
  }
  /**
   * @description: Delete based on field name
   */
  function removeSchemaByFiled(fields: string | string[]): void {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }
    let fieldList: string[] = fields as string[];
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      _removeSchemaByFiled(field, schemaList);
    }
    schemaRef.value = schemaList as any;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFiled(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const index = schemaList.findIndex((schema) => schema.field === field);
      if (index !== -1) {
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  function appendSchemaByField(schema: FormSchema, prefixField?: string) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));

    const index = schemaList.findIndex((schema) => schema.field === prefixField);
    const hasInList = schemaList.find((item) => item.field === schema.field);

    if (hasInList) {
      return;
    }
    if (!prefixField || index === -1) {
      schemaList.push(schema);
      schemaRef.value = schemaList as any;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    schemaRef.value = schemaList as any;
  }

  function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }
    const hasField = updateData.every((item) => Reflect.has(item, 'field') && item.field);
    if (!hasField) {
      throw new Error('Must pass in the `field` field!');
    }
    const schema: FormSchema[] = [];
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (val.field === item.field) {
          const newSchema = deepMerge(val, item);
          schema.push(newSchema as FormSchema);
        } else {
          schema.push(val);
        }
      });
    });
    schemaRef.value = unique(schema, 'field') as any;
  }

  function getFieldsValue(): any {
    const formEl = unref(formElRef);
    if (!formEl) return;
    return handleFormValues(toRaw(unref(formModel)));
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some((item) => {
      return item.field === key ? dateItemType.includes(item.component!) : false;
    });
  }

  function validateFields(nameList?: NamePath[] | undefined) {
    if (!formElRef.value) return;
    return formElRef.value.validateFields(nameList);
  }

  function validate(nameList?: NamePath[] | undefined) {
    if (!formElRef.value) return;
    return formElRef.value.validate(nameList);
  }

  function clearValidate(name?: string | string[]) {
    if (!formElRef.value) return;
    formElRef.value.clearValidate(name);
  }

  /**
   * @description: Form submission
   */
  async function handleSubmit(e?: Event): Promise<void> {
    e && e.preventDefault();
    const { submitFunc } = unref(getProps);
    if (submitFunc && isFunction(submitFunc)) {
      await submitFunc();
      return;
    }
    const formEl = unref(formElRef);
    if (!formEl) return;
    try {
      const values = await validate();
      const res = handleFormValues(values);
      emit('submit', res);
    } catch (error) {}
  }
  actionState.resetAction = {
    onClick: resetFields,
  };

  actionState.submitAction = {
    onClick: handleSubmit,
  };

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    setFieldsValue,
  };
}
