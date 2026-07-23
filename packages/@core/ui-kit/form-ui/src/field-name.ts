import { get, isObject, set } from '@vben-core/shared/utils';

export function deleteValueByFieldName(
  values: Record<string, any>,
  fieldName: string,
) {
  const { pathSegments, rawKey } = resolveFieldNamePath(fieldName);
  if (rawKey) {
    Reflect.deleteProperty(values, rawKey);
    return;
  }

  if (pathSegments.length === 0) {
    Reflect.deleteProperty(values, fieldName);
    return;
  }

  let target: Record<string, any> | undefined = values;
  for (const segment of pathSegments.slice(0, -1)) {
    if (!target || !isObject(target)) {
      return;
    }
    target = target[segment];
  }

  const lastPathSegment = pathSegments.at(-1);
  if (!target || !isObject(target) || !lastPathSegment) {
    return;
  }
  Reflect.deleteProperty(target, lastPathSegment);
}

export function getValueByFieldName(
  values: Record<string, any>,
  fieldName: string,
) {
  const { rawKey } = resolveFieldNamePath(fieldName);
  return rawKey ? values[rawKey] : get(values, fieldName);
}

export function resolveChildUpdateFieldName(
  parentFieldName: string,
  fieldName: string,
) {
  if (fieldName.startsWith(`${parentFieldName}.`)) {
    return fieldName.slice(parentFieldName.length + 1);
  }

  const indexedPrefix = `${parentFieldName}[`;
  if (!fieldName.startsWith(indexedPrefix)) {
    return;
  }

  const closeIndex = fieldName.indexOf(']', indexedPrefix.length);
  if (closeIndex === -1 || fieldName[closeIndex + 1] !== '.') {
    return;
  }
  return fieldName.slice(closeIndex + 2);
}

export function resolveFieldNamePath(fieldName: string) {
  if (fieldName.startsWith('[') && fieldName.endsWith(']')) {
    const rawKey = fieldName.slice(1, -1);
    return {
      pathSegments: [rawKey],
      rawKey,
    };
  }

  return {
    pathSegments: fieldName.match(/[^.[\]]+/g) ?? [],
    rawKey: undefined,
  };
}

export function resolveValueFormatFieldName(
  fieldName: string,
  parentPath?: string,
) {
  if (!parentPath) {
    return fieldName;
  }
  if (fieldName.startsWith('$root.')) {
    return fieldName.slice('$root.'.length);
  }
  if (fieldName.startsWith('$row.')) {
    return `${parentPath}.${fieldName.slice('$row.'.length)}`;
  }
  if (fieldName === parentPath || fieldName.startsWith(`${parentPath}.`)) {
    return fieldName;
  }
  return `${parentPath}.${fieldName}`;
}

export function setValueByFieldName(
  values: Record<string, any>,
  fieldName: string,
  value: any,
) {
  const { rawKey } = resolveFieldNamePath(fieldName);
  if (rawKey) {
    values[rawKey] = value;
    return;
  }
  set(values, fieldName, value);
}
