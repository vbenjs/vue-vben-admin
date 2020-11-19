import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import moment from 'moment';
import { unref } from 'vue';
import type { Ref, ComputedRef } from 'vue';
import type { FieldMapToTime, FormSchema } from '../types/form';

interface UseFormValuesContext {
  transformDateFuncRef: Ref<Fn>;
  fieldMapToTimeRef: Ref<FieldMapToTime>;
  defaultValueRef: Ref<any>;
  getSchema: ComputedRef<FormSchema[]>;
  formModel: any;
}
export function useFormValues({
  transformDateFuncRef,
  fieldMapToTimeRef,
  defaultValueRef,
  getSchema,
  formModel,
}: UseFormValuesContext) {
  // Processing form values
  function handleFormValues(values: any) {
    if (!isObject(values)) {
      return {};
    }
    const resMap: any = {};
    for (const item of Object.entries(values)) {
      let [, value] = item;
      const [key] = item;
      if ((isArray(value) && value.length === 0) || isFunction(value)) {
        continue;
      }
      const transformDateFunc = unref(transformDateFuncRef);
      if (isObject(value)) {
        value = transformDateFunc(value);
      }
      if (isArray(value) && value[0]._isAMomentObject && value[1]._isAMomentObject) {
        value = value.map((item) => transformDateFunc(item));
      }
      // Remove spaces
      if (isString(value)) {
        value = value.trim();
      }
      resMap[key] = value;
    }
    return handleRangeTimeValue(resMap);
  }

  /**
   * @description: Processing time interval parameters
   */
  function handleRangeTimeValue(values: any) {
    const fieldMapToTime = unref(fieldMapToTimeRef);

    if (!fieldMapToTime || !Array.isArray(fieldMapToTime)) {
      return values;
    }

    for (const [field, [startTimeKey, endTimeKey, format = 'YYYY-MM-DD']] of fieldMapToTime) {
      if (!field || !startTimeKey || !endTimeKey || !values[field]) {
        continue;
      }

      const [startTime, endTime]: string[] = values[field];

      values[startTimeKey] = moment(startTime).format(format);
      values[endTimeKey] = moment(endTime).format(format);
    }

    return values;
  }

  function initDefault() {
    const schemas = unref(getSchema);
    const obj: any = {};
    schemas.forEach((item) => {
      if (item.defaultValue) {
        obj[item.field] = item.defaultValue;
        (formModel as any)[item.field] = item.defaultValue;
      }
    });
    defaultValueRef.value = obj;
  }

  return { handleFormValues, initDefault };
}
