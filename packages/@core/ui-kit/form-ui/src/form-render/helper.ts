import type { ZodType } from 'zod';

import { toRaw } from 'vue';

import { isObject, isString } from '@vben-core/shared/utils';

import { ZodPipe } from 'zod';

type UnwrappableZodType = ZodType & {
  unwrap?: () => ZodType;
};

/**
 * Get the lowest level Zod type.
 * This will unpack optionals, refinements, etc.
 */
export function getBaseRules(schema?: null | string | ZodType): null | ZodType {
  if (!schema || isString(schema)) return null;
  const rawSchema = toRaw(schema);

  if (rawSchema instanceof ZodPipe) {
    return getBaseRules(rawSchema.in as ZodType);
  }

  const unwrappedSchema = (rawSchema as UnwrappableZodType).unwrap?.();
  if (unwrappedSchema && unwrappedSchema !== rawSchema) {
    return getBaseRules(unwrappedSchema);
  }

  return rawSchema;
}

/**
 * Search for a "ZodDefault" in the Zod stack and return its value.
 */
export function getDefaultValueInZodStack(
  schema?: null | string | ZodType,
): any {
  if (!schema || isString(schema)) {
    return;
  }

  try {
    const result = toRaw(schema).safeParse(undefined);
    return result.success ? result.data : undefined;
  } catch {
    return undefined;
  }
}

export function isEventObjectLike(obj: any) {
  if (!obj || !isObject(obj)) {
    return false;
  }
  return Reflect.has(obj, 'target') && Reflect.has(obj, 'stopPropagation');
}
