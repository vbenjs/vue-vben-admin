import type { ComputedRef, Ref } from 'vue';
import { toRaw, unref } from 'vue';
import type { FormActionType, FormProps, FormSchema } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import { deepMerge } from '/@/utils';
import {
  getProperty,
  hasProperty,
  setProperty,
  handleInputNumberValue,
  rangeDateItemType,
  singleDateItemType,
  dateItemType,
  deleteProperty,
} from '../helper';
import { dateUtil } from '/@/utils/dateUtil';
import { cloneDeep, isEqual, uniqBy } from 'lodash-es';
import { error } from '/@/utils/log';

interface UseFormActionContext {
  emit: EmitType;
  getProps: ComputedRef<FormProps>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: Recordable;
  defaultValueRef: Ref<Recordable>;
  formElRef: Ref<FormActionType>;
  schemaRef: Ref<FormSchema[]>;
  handleFormValues: Fn;
}

export function useFormEvents({
  emit,
  getProps,
  formModel,
  getSchema,
  defaultValueRef,
  formElRef,
  schemaRef,
  handleFormValues,
}: UseFormActionContext) {
  async function resetFields(): Promise<void> {
    const { resetFunc, submitOnReset } = unref(getProps);
    resetFunc && isFunction(resetFunc) && (await resetFunc());

    const formEl = unref(formElRef);
    if (!formEl) return;

    const schemas = unref(getSchema);
    schemas.forEach((item) => {
      const defaultValue = getProperty(defaultValueRef.value, item.field);
      setProperty(formModel, item.field, defaultValue);
    });
    clearValidate();
    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }

  /**
   * @description: Set form value
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    // Object.keys(values).forEach((key) => {
    //   formModel[key] = values[key];
    // });
    const schemas = unref(getSchema).filter((item) => item.field);
    const validKeys: NamePath[] = [];
    schemas.forEach((schema) => {
      let value = getProperty(values, schema.field);
      value = handleInputNumberValue(schema?.component, value);
      const hasKey = hasProperty(values, schema.field);
      // 0| '' is allow
      if (hasKey && singleDateItemType.includes(schema?.component)) {
        const { componentProps } = schema || {};
        let _props = componentProps as any;
        if (typeof componentProps === 'function') {
          _props = _props({ formModel });
        }
        setProperty(
          formModel,
          schema.field,
          value ? (_props?.valueFormat ? value : dateUtil(value)) : null,
        );
        validKeys.push(schema.field);
      } else if (hasKey && !dateItemType.includes(schema?.component)) {
        setProperty(formModel, schema.field, value);
        validKeys.push(schema.field);
      } else if (rangeDateItemType.includes(schema?.component)) {
        if (hasKey && Array.isArray(value)) {
          const arr: any[] = [];
          for (const ele of value) {
            arr.push(ele ? dateUtil(ele) : null);
          }
          setProperty(formModel, schema.field, arr);
          validKeys.push(schema.field);
        } else {
          const fieldMapToTime = getFieldMapToTime(schema.field);
          if (fieldMapToTime != null) {
            const [field, [startTimeKey, endTimeKey]] = fieldMapToTime;
            const arr: any[] = [];

            const hasStartTime = hasProperty(values, startTimeKey);
            const hasEndTime = hasProperty(values, endTimeKey);
            const startTime = getProperty(values, startTimeKey);
            const endTime = getProperty(values, endTimeKey);
            const fieldValue = getProperty(formModel, field);
            arr.push(
              hasStartTime
                ? startTime
                  ? dateUtil(startTime)
                  : null
                : isArray(fieldValue) && fieldValue.length > 0
                ? fieldValue[0]
                : null,
            );
            arr.push(
              hasEndTime
                ? endTime
                  ? dateUtil(endTime)
                  : null
                : isArray(fieldValue) && fieldValue.length > 1
                ? fieldValue[1]
                : null,
            );
            setProperty(formModel, schema.field, arr);
            validKeys.push(schema.field);
          }
        }
      }
    });
    validateFields(validKeys).catch((_) => {});
  }

  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByFiled(field: NamePath): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!field) {
      return;
    }
    _removeSchemaByFiled(field, schemaList);
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFiled(field: NamePath, schemaList: FormSchema[]): void {
    if (isString(field) || isArray(field)) {
      const index = schemaList.findIndex((schema) => isEqual(schema.field, field));
      if (index !== -1) {
        deleteProperty(formModel, field);
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: get field map to time config
   */
  function getFieldMapToTime(field: string | number | (string | number)[]) {
    const fieldMapToTime = unref(getProps).fieldMapToTime;
    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return null;
    }
    return fieldMapToTime.find((item) => {
      return isEqual(item[0], field);
    });
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(
    schema: FormSchema,
    prefixField?: string | number | (string | number)[],
    first = false,
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));

    const index = schemaList.findIndex((schema) => isEqual(schema.field, prefixField));

    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(schema) : schemaList.push(schema);
      schemaRef.value = schemaList;
      return;
    }
    if (index !== -1) {
      schemaList.splice(index + 1, 0, schema);
    }
    schemaRef.value = schemaList;
  }

  async function resetSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field',
      );
      return;
    }
    schemaRef.value = updateData as FormSchema[];
  }

  async function updateSchema(data: Partial<FormSchema> | Partial<FormSchema>[]) {
    let updateData: Partial<FormSchema>[] = [];
    if (isObject(data)) {
      updateData.push(data as FormSchema);
    }
    if (isArray(data)) {
      updateData = [...data];
    }

    const hasField = updateData.every(
      (item) => item.component === 'Divider' || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field',
      );
      return;
    }
    const schema: FormSchema[] = [];
    updateData.forEach((item) => {
      unref(getSchema).forEach((val) => {
        if (isEqual(val.field, item.field)) {
          const newSchema = deepMerge(val, item);
          schema.push(newSchema as FormSchema);
        } else {
          schema.push(val);
        }
      });
    });
    schemaRef.value = uniqBy(schema, 'field');
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(unref(formModel)));
  }

  async function validateFields(nameList?: NamePath[] | undefined) {
    return unref(formElRef)?.validateFields(nameList);
  }

  async function validate(nameList?: NamePath[] | undefined) {
    return await unref(formElRef)?.validate(nameList);
  }

  async function clearValidate(name?: string | string[]) {
    await unref(formElRef)?.clearValidate(name);
  }

  async function scrollToField(name: NamePath, options?: ScrollOptions | undefined) {
    await unref(formElRef)?.scrollToField(name, options);
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
    } catch (error: any) {
      throw new Error(error);
    }
  }

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByFiled,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}
