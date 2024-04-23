import type { ComputedRef, Ref } from 'vue';
import type { FormProps, FormSchemaInner as FormSchema, FormActionType } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import { unref, toRaw, nextTick } from 'vue';
import { isArray, isFunction, isObject, isString, isDef, isNil } from '@/utils/is';
import { deepMerge } from '@/utils';
import {
  dateItemType,
  handleInputNumberValue,
  defaultValueComponents,
  isIncludeSimpleComponents,
} from '../helper';
import { dateUtil } from '@/utils/dateUtil';
import { cloneDeep, has, uniqBy, get } from 'lodash-es';
import { error } from '@/utils/log';

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

    Object.keys(formModel).forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      const defaultValueObj = schema?.defaultValueObj;
      const fieldKeys = Object.keys(defaultValueObj || {});
      if (fieldKeys.length) {
        fieldKeys.forEach((field) => {
          formModel[field] = defaultValueObj![field];
        });
      }
      formModel[key] = getDefaultValue(schema, defaultValueRef, key);
    });
    nextTick(() => clearValidate());

    emit('reset', toRaw(formModel));
    submitOnReset && handleSubmit();
  }
  // 获取表单fields
  const getAllFields = () =>
    unref(getSchema)
      .map((item) => [...(item.fields || []), item.field])
      .flat(1)
      .filter(Boolean);
  /**
   * @description: Set form value
   */
  async function setFieldsValue(values: Recordable): Promise<void> {
    if (Object.keys(values).length === 0) {
      return;
    }

    const fields = getAllFields();

    const validKeys: string[] = [];
    fields.forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = get(values, key);
      const hasKey = has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      const { componentProps } = schema || {};
      let _props = componentProps as any;
      if (typeof componentProps === 'function') {
        _props = _props({
          formModel: unref(formModel),
          formActionType,
        });
      }

      const constructValue = get(value, key);
      const setDateFieldValue = (v) => {
        return v ? (_props?.valueFormat ? v : dateUtil(v)) : null;
      };

      // 0| '' is allow
      if (hasKey || !!constructValue) {
        const fieldValue = constructValue || value;
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(fieldValue)) {
            const arr: any[] = [];
            for (const ele of fieldValue) {
              arr.push(setDateFieldValue(ele));
            }
            unref(formModel)[key] = arr;
          } else {
            unref(formModel)[key] = setDateFieldValue(fieldValue);
          }
        } else {
          unref(formModel)[key] = fieldValue;
        }
        if (_props?.onChange) {
          _props?.onChange(fieldValue);
        }
        validKeys.push(key);
      } else {
        // key not exist
        if (isDef(get(defaultValueRef.value, key))) {
          unref(formModel)[key] = cloneDeep(unref(get(defaultValueRef.value, key)));
        }
      }
    });
    validateFields(validKeys).catch((_) => {});
  }

  /**
   * @description: Delete based on field name
   */
  async function removeSchemaByField(fields: string | string[]): Promise<void> {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    if (!fields) {
      return;
    }

    let fieldList: string[] = isString(fields) ? [fields] : fields;
    if (isString(fields)) {
      fieldList = [fields];
    }
    for (const field of fieldList) {
      _removeSchemaByField(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByField(field: string, schemaList: FormSchema[]): void {
    if (isString(field)) {
      const index = schemaList.findIndex((schema) => schema.field === field);
      if (index !== -1) {
        delete formModel[field];
        schemaList.splice(index, 1);
      }
    }
  }

  /**
   * @description: Insert after a certain field, if not insert the last
   */
  async function appendSchemaByField(
    schema: FormSchema | FormSchema[],
    prefixField?: string,
    first = false,
  ) {
    const schemaList: FormSchema[] = cloneDeep(unref(getSchema));
    const addSchemaIds: string[] = Array.isArray(schema)
      ? schema.map((item) => item.field)
      : [schema.field];
    if (schemaList.find((item) => addSchemaIds.includes(item.field))) {
      error('There are schemas that have already been added');
      return;
    }
    const index = schemaList.findIndex((schema) => schema.field === prefixField);
    const _schemaList = isObject(schema) ? [schema as FormSchema] : (schema as FormSchema[]);
    if (!prefixField || index === -1 || first) {
      first ? schemaList.unshift(..._schemaList) : schemaList.push(..._schemaList);
    } else if (index !== -1) {
      schemaList.splice(index + 1, 0, ..._schemaList);
    }
    schemaRef.value = schemaList;
    _setDefaultValue(schema);
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
      (item) =>
        isIncludeSimpleComponents(item.component) || (Reflect.has(item, 'field') && item.field),
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
      (item) =>
        isIncludeSimpleComponents(item.component) || (Reflect.has(item, 'field') && item.field),
    );

    if (!hasField) {
      error(
        'All children of the form Schema array that need to be updated must contain the `field` field',
      );
      return;
    }
    const schema: FormSchema[] = [];
    const updatedSchema: FormSchema[] = [];
    unref(getSchema).forEach((val) => {
      const updatedItem = updateData.find((item) => val.field === item.field);

      if (updatedItem) {
        const newSchema = deepMerge(val, updatedItem);
        updatedSchema.push(newSchema as FormSchema);
        schema.push(newSchema as FormSchema);
      } else {
        schema.push(val);
      }
    });
    _setDefaultValue(updatedSchema);

    schemaRef.value = uniqBy(schema, 'field');
  }

  function _setDefaultValue(data: FormSchema | FormSchema[]) {
    let schemas: FormSchema[] = [];
    if (isObject(data)) {
      schemas.push(data as FormSchema);
    }
    if (isArray(data)) {
      schemas = [...data];
    }

    const obj: Recordable = {};
    const currentFieldsValue = getFieldsValue();
    schemas.forEach((item) => {
      if (
        !isIncludeSimpleComponents(item.component) &&
        Reflect.has(item, 'field') &&
        item.field &&
        !isNil(item.defaultValue) &&
        (!(item.field in currentFieldsValue) || isNil(currentFieldsValue[item.field]))
      ) {
        obj[item.field] = item.defaultValue;
      }
    });
    setFieldsValue(obj);
  }

  function getFieldsValue(): Recordable {
    const formEl = unref(formElRef);
    if (!formEl) return {};
    return handleFormValues(toRaw(unref(formModel)));
  }

  /**
   * @description: Is it time
   */
  function itemIsDateType(key: string) {
    return unref(getSchema).some((item) => {
      return item.field === key && item.component ? dateItemType.includes(item.component) : false;
    });
  }

  async function validateFields(nameList?: NamePath[] | undefined) {
    const values = await unref(formElRef)?.validateFields(nameList);
    return handleFormValues(values);
  }

  async function setProps(formProps: Partial<FormProps>): Promise<void> {
    await unref(formElRef)?.setProps(formProps);
  }

  async function validate(nameList?: NamePath[] | false | undefined) {
    let _nameList: any;
    if (nameList === undefined) {
      _nameList = getAllFields();
    } else {
      _nameList = nameList === Array.isArray(nameList) ? nameList : undefined;
    }
    const values = await unref(formElRef)?.validate(_nameList);
    return handleFormValues(values);
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
      emit('submit', values);
    } catch (error: any) {
      if (error?.outOfDate === false && error?.errorFields) {
        return;
      }
      throw new Error(error);
    }
  }

  const formActionType: Partial<FormActionType> = {
    getFieldsValue,
    setFieldsValue,
    resetFields,
    updateSchema,
    resetSchema,
    setProps,
    removeSchemaByField,
    appendSchemaByField,
    clearValidate,
    validateFields,
    validate,
    submit: handleSubmit,
    scrollToField: scrollToField,
  };

  return {
    handleSubmit,
    clearValidate,
    validate,
    validateFields,
    getFieldsValue,
    updateSchema,
    resetSchema,
    appendSchemaByField,
    removeSchemaByField,
    resetFields,
    setFieldsValue,
    scrollToField,
  };
}

function getDefaultValue(
  schema: FormSchema | undefined,
  defaultValueRef: UseFormActionContext['defaultValueRef'],
  key: string,
) {
  let defaultValue = cloneDeep(defaultValueRef.value[key]);
  const isInput = checkIsInput(schema);
  if (isInput) {
    return defaultValue || undefined;
  }
  if (!defaultValue && schema && checkIsRangeSlider(schema)) {
    defaultValue = [0, 0];
  }
  if (!defaultValue && schema && schema.component === 'ApiTree') {
    defaultValue = [];
  }
  return defaultValue;
}

function checkIsRangeSlider(schema: FormSchema) {
  if (schema.component === 'Slider' && schema.componentProps && 'range' in schema.componentProps) {
    return true;
  }
}

function checkIsInput(schema?: FormSchema) {
  return schema?.component && defaultValueComponents.includes(schema.component);
}
