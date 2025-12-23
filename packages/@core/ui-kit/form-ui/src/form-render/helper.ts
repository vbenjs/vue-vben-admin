import type { ZodType } from 'zod';

import { isObject, isString } from '@vben-core/shared/utils';

import {
  ZodDefault,
  ZodIntersection,
  ZodNullable,
  ZodObject,
  ZodOptional,
} from 'zod';

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
export function getBaseRules_byZodSchema(schema: ZodType): null | ZodType {
  if (!schema || isString(schema)) {
    return null;
  }

  if (
    schema instanceof ZodDefault ||
    schema instanceof ZodOptional ||
    schema instanceof ZodNullable
  ) {
    return getBaseRules_byZodSchema(schema._zod.def.innerType as ZodType);
  }

  return schema;
}

/**
 * Search for a "ZodDefault" in the Zod stack and return its value.
 */
export function getDefaultValue_byZodSchema(schema: ZodType): any {
  if (!schema || isString(schema)) {
    return;
  }

  if (schema instanceof ZodDefault) {
    return schema._zod.def.defaultValue;
  }

  if (schema instanceof ZodOptional || schema instanceof ZodNullable) {
    return getDefaultValue_byZodSchema(schema._zod.def.innerType as ZodType);
  }

  return undefined;
}

// 自定义默认值提取逻辑
export function getCustomDefaultValue_byZodSchema(schema: ZodType): any {
  if (schema instanceof ZodDefault || schema instanceof ZodOptional) {
    return getCustomDefaultValue_byZodSchema(
      schema._zod.def.innerType as ZodType,
    );
  }

  // 如果是字符串类型，则返回空字符串，涵盖 z.string(), z.email() ...
  switch (schema.type) {
    case 'boolean': {
      return false; // 默认为 false
    }
    case 'intersection': {
      // 对于交集类型，从schema 提取默认值
      const leftDefaultValue = getCustomDefaultValue_byZodSchema(
        (schema as ZodIntersection)._zod.def.left as ZodType,
      );
      const rightDefaultValue = getCustomDefaultValue_byZodSchema(
        (schema as ZodIntersection)._zod.def.right as ZodType,
      );

      // 如果左右两边都能提取默认值，合并它们
      if (isObject(leftDefaultValue) && isObject(rightDefaultValue)) {
        return { ...leftDefaultValue, ...rightDefaultValue };
      }

      // 否则优先使用左边的默认值
      return leftDefaultValue ?? rightDefaultValue;
    }
    case 'number': {
      return null; // 默认为 null（避免显示 0）
    }
    case 'object': {
      // 递归提取嵌套对象的默认值
      const defaultValues: Record<string, any> = {};
      for (const [key, valueSchema] of Object.entries(
        (schema as ZodObject).shape,
      )) {
        defaultValues[key] = getCustomDefaultValue_byZodSchema(valueSchema);
      }
      return defaultValues;
    }
    case 'string': {
      return ''; // 默认为空字符串
    }
    default: {
      return undefined; // 其他类型不提供默认值
    }
  }
}

export function isEventObjectLike(obj: any) {
  if (!obj || !isObject(obj)) {
    return false;
  }
  return Reflect.has(obj, 'target') && Reflect.has(obj, 'stopPropagation');
}
