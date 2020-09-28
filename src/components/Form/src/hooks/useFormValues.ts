import { isArray, isFunction, isObject, isString } from '/@/utils/is';
import moment from 'moment';
import { unref } from 'vue';
import type { Ref } from 'vue';
import type { FieldMapToTime } from '../types/form';

export function useFormValues(
  transformDateFuncRef: Ref<Fn>,
  fieldMapToTimeRef: Ref<FieldMapToTime>
) {
  // 处理表单值
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
      // 去除空格
      if (isString(value)) {
        value = value.trim();
      }
      resMap[key] = value;
    }
    return handleRangeTimeValue(resMap);
  }
  /**
   * @description: 处理时间区间参数
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
  return handleFormValues;
}
