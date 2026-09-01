import type { ZodType } from 'zod';

import type { FormSchemaRuleType } from './types';

import { toRaw } from 'vue';

import { isString, mergeWithArrayOverride, set } from '@vben-core/shared/utils';

import { object, ZodIntersection, ZodNumber, ZodObject, ZodString } from 'zod';
import { getDefaultsForSchema } from 'zod-defaults';

/** 仅依赖计算默认值所需的最小字段结构，兼容任意泛型表单定义 */
interface SchemaLike {
  defaultValue?: any;
  fieldName: string;
  rules?: FormSchemaRuleType;
}

/**
 * 根据表单定义计算默认值。
 *
 * 优先取字段显式声明的默认值；未声明时，尝试从校验规则中推断。
 * 动态表单在定义变化后需重新计算，否则重置时会恢复到挂载时的旧默认值
 */
export function generateSchemaDefaultValues(
  schema: readonly SchemaLike[] = [],
): Record<string, any> {
  const initialValues: Record<string, any> = {};

  const zodObject: Record<string, ZodType> = {};
  (schema || []).forEach((item) => {
    if (Reflect.has(item, 'defaultValue')) {
      set(initialValues, item.fieldName, item.defaultValue);
    } else if (item.rules && !isString(item.rules)) {
      // 检查规则是否适合提取默认值
      const rawRules = toRaw(item.rules);
      const customDefaultValue = getCustomDefaultValue(rawRules);
      zodObject[item.fieldName] = rawRules;
      if (customDefaultValue !== undefined) {
        initialValues[item.fieldName] = customDefaultValue;
      }
    }
  });

  const schemaInitialValues = getDefaultsForSchema(object(zodObject));

  const zodDefaults: Record<string, any> = {};
  for (const key in schemaInitialValues) {
    set(zodDefaults, key, schemaInitialValues[key]);
  }
  return mergeWithArrayOverride(initialValues, zodDefaults);
}

/** 从校验规则中推断默认值 */
function getCustomDefaultValue(rule: any): any {
  rule = toRaw(rule);
  if (rule instanceof ZodString) {
    return ''; // 默认为空字符串
  } else if (rule instanceof ZodNumber) {
    return null; // 默认为 null（避免显示 0）
  } else if (rule instanceof ZodObject) {
    // 递归提取嵌套对象的默认值
    const defaultValues: Record<string, any> = {};
    for (const [key, valueSchema] of Object.entries(rule.shape)) {
      defaultValues[key] = getCustomDefaultValue(valueSchema);
    }
    return defaultValues;
  } else if (rule instanceof ZodIntersection) {
    return getDefaultsForSchema(rule);
  } else {
    return undefined; // 其他类型不提供默认值
  }
}
