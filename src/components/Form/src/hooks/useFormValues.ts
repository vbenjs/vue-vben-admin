import { isArray, isFunction, isNullOrUnDef, isObject, isString } from '/@/utils/is';
import { dateUtil } from '/@/utils/dateUtil';
import type { ComputedRef, Ref } from 'vue';
import { unref } from 'vue';
import type { FormProps, FormSchema } from '../types/form';
import { getProperty, setProperty, deleteProperty } from '../helper';
import { isDayjs } from 'dayjs';

interface UseFormValuesContext {
  defaultValueRef: Ref<any>;
  getSchema: ComputedRef<FormSchema[]>;
  getProps: ComputedRef<FormProps>;
  formModel: Recordable;
}

export function useFormValues({
  defaultValueRef,
  getSchema,
  formModel,
  getProps,
}: UseFormValuesContext) {
  function transformValues(values: Record<any, any>) {
    const res: Recordable = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if (!key || (isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      const transformDateFunc = unref(getProps).transformDateFunc;
      if (isObject(value)) {
        if (isDayjs(value)) {
          value = transformDateFunc?.(value);
        } else {
          value = transformValues(value);
        }
      }

      if (isArray(value) && value[0]?.format && value[1]?.format) {
        value = value.map((item) => transformDateFunc?.(item));
      }
      // Remove spaces
      if (isString(value)) {
        value = value.trim();
      }
      setProperty(res, key, value);
    }
    return res;
  }

  // Processing form values
  function handleFormValues(values: Recordable) {
    if (!isObject(values)) {
      return {};
    }
    const res = transformValues(values);
    return handleRangeTimeValue(res);
  }

  /**
   * @description: Processing time interval parameters
   */
  function handleRangeTimeValue(values: Recordable) {
    const fieldMapToTime = unref(getProps).fieldMapToTime;

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }

    for (const [field, [startTimeKey, endTimeKey], format = 'YYYY-MM-DD'] of fieldMapToTime) {
      const rangeTime = getProperty(values, field);
      if (!field || !startTimeKey || !endTimeKey || !rangeTime) {
        continue;
      }
      const [startTime, endTime]: string[] = rangeTime;
      deleteProperty(values, field);
      setProperty(values, startTimeKey, dateUtil(startTime).format(format));
      setProperty(values, endTimeKey, dateUtil(endTime).format(format));
    }
    return values;
  }

  function initDefault() {
    const schemas = unref(getSchema);
    const obj: Recordable = {};
    schemas.forEach((item) => {
      const { defaultValue } = item;
      if (!isNullOrUnDef(defaultValue)) {
        setProperty(obj, item.field, defaultValue);
        setProperty(formModel, item.field, defaultValue);
      }
    });
    defaultValueRef.value = obj;
  }

  return { handleFormValues, initDefault };
}
