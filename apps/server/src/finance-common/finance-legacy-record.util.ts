export function pickFirstString(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null) {
      continue;
    }
    let normalized = '';
    if (typeof value === 'string') {
      normalized = value.trim();
    } else if (
      typeof value === 'bigint' ||
      typeof value === 'boolean' ||
      typeof value === 'number'
    ) {
      normalized = String(value).trim();
    }
    if (normalized) {
      return normalized;
    }
  }

  return '';
}

export function pickFirstNumber(item: Record<string, unknown>, keys: string[]) {
  const rawValue = pickFirstString(item, keys);
  if (!rawValue) {
    return null;
  }

  const parsed = Number.parseFloat(rawValue.replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
}
