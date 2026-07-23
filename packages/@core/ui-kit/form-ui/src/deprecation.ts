const warnedDeprecations = new Set<string>();

export function resetDeprecationWarnings() {
  warnedDeprecations.clear();
}

export function warnDeprecatedOnce(
  key: string,
  message: string,
  options: { production?: boolean } = {},
) {
  const production = options.production ?? import.meta.env.PROD;
  if (production || warnedDeprecations.has(key)) {
    return;
  }
  warnedDeprecations.add(key);
  console.warn(message);
}
