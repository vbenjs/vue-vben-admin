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
