import type { ComputedRef, Ref } from 'vue';
import type { FormProps, FormSchemaInner as FormSchema, FormActionType } from '../types/form';
import type { NamePath } from 'ant-design-vue/lib/form/interface';
import { unref, toRaw, nextTick } from 'vue';
import {
  isArray,
  isFunction,
  isObject,
  isString,
  isDef,
  isNullOrUnDef,
  isEmpty,
} from '/@/utils/is';
import { deepMerge } from '/@/utils';
import { dateItemType, handleInputNumberValue, defaultValueComponents } from '../helper';
import { dateUtil } from '/@/utils/dateUtil';
import { cloneDeep, set, uniqBy, get } from 'lodash-es';
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

function tryConstructArray(field: string, values: Recordable = {}): any[] | undefined {
  const pattern = /^\[(.+)\]$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      if (!keys.length) {
        return undefined;
      }

      const result = [];
      keys.forEach((k, index) => {
        set(result, index, values[k.trim()]);
      });

      return result.filter(Boolean).length ? result : undefined;
    }
  }
}

function tryConstructObject(field: string, values: Recordable = {}): Recordable | undefined {
  const pattern = /^\{(.+)\}$/;
  if (pattern.test(field)) {
    const match = field.match(pattern);
    if (match && match[1]) {
      const keys = match[1].split(',');
      if (!keys.length) {
        return;
      }

      const result = {};
      keys.forEach((k) => {
        set(result, k.trim(), values[k.trim()]);
      });

      return Object.values(result).filter(Boolean).length ? result : undefined;
    }
  }
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
        fieldKeys.map((field) => {
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
    const fields = getAllFields();

    // key 支持 a.b.c 的嵌套写法
    const delimiter = '.';
    const nestKeyArray = fields.filter((item) => String(item).indexOf(delimiter) >= 0);

    const validKeys: string[] = [];
    fields.forEach((key) => {
      const schema = unref(getSchema).find((item) => item.field === key);
      let value = get(values, key);
      const hasKey = Reflect.has(values, key);

      value = handleInputNumberValue(schema?.component, value);
      const { componentProps } = schema || {};
      let _props = componentProps as any;
      if (typeof componentProps === 'function') {
        _props = _props({ formModel: unref(formModel) });
      }

      const constructValue = tryConstructArray(key, values) || tryConstructObject(key, values);

      // 0| '' is allow
      if (hasKey || !!constructValue) {
        const fieldValue = constructValue || value;
        // time type
        if (itemIsDateType(key)) {
          if (Array.isArray(fieldValue)) {
            const arr: any[] = [];
            for (const ele of fieldValue) {
              arr.push(ele ? dateUtil(ele) : null);
            }
            unref(formModel)[key] = arr;
          } else {
            unref(formModel)[key] = fieldValue
              ? _props?.valueFormat
                ? fieldValue
                : dateUtil(fieldValue)
              : null;
          }
        } else {
          unref(formModel)[key] = fieldValue;
        }
        if (_props?.onChange) {
          _props?.onChange(fieldValue);
        }
        validKeys.push(key);
      } else {
        nestKeyArray.forEach((nestKey: string) => {
          try {
            const value = nestKey.split('.').reduce((out, item) => out[item], values);
            if (isDef(value)) {
              unref(formModel)[nestKey] = unref(value);
              validKeys.push(nestKey);
            }
          } catch (e) {
            // key not exist
            if (isDef(defaultValueRef.value[nestKey])) {
              unref(formModel)[nestKey] = cloneDeep(unref(defaultValueRef.value[nestKey]));
            }
          }
        });
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
      _removeSchemaByFeild(field, schemaList);
    }
    schemaRef.value = schemaList;
  }

  /**
   * @description: Delete based on field name
   */
  function _removeSchemaByFeild(field: string, schemaList: FormSchema[]): void {
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
    unref(getSchema).forEach((val) => {
      let _val;
      updateData.forEach((item) => {
        if (val.field === item.field) {
          _val = item;
        }
      });
      if (_val !== undefined && val.field === _val.field) {
        const newSchema = deepMerge(val, _val);
        schema.push(newSchema as FormSchema);
      } else {
        schema.push(val);
      }
    });
    _setDefaultValue(schema);

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
        item.component != 'Divider' &&
        Reflect.has(item, 'field') &&
        item.field &&
        !isNullOrUnDef(item.defaultValue) &&
        (!(item.field in currentFieldsValue) ||
          isNullOrUnDef(currentFieldsValue[item.field]) ||
          isEmpty(currentFieldsValue[item.field]))
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
    const values = unref(formElRef)?.validateFields(nameList);
    return handleFormValues(values);
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
    return defaultValue || '';
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
