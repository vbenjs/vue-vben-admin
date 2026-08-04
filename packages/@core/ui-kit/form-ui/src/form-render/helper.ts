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

  // In zod v4, ZodArray also has an unwrap() that returns its element type
  // (not an outer wrapper). We must not unwrap it, otherwise z.array(T) loses
  // its array shell and array values fail validation.
  const defType = (rawSchema as unknown as { _zod?: { def: { type: string } } })
    ._zod?.def?.type;
  if (defType === 'array') {
    return rawSchema;
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
