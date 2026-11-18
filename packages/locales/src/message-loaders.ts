import type { Locale } from 'vue-i18n';

import type { ImportLocaleFn, LoadMessageFn, LocaleMessages } from './typing';

/**
 * Load locale modules
 * @param modules
 */
function loadLocalesMap(modules: Record<string, () => Promise<unknown>>) {
  const localesMap: Record<Locale, ImportLocaleFn> = Object.create(null);

  for (const [path, loadLocale] of Object.entries(modules)) {
    const key = path.match(/([\w-]*)\.(json)/)?.[1];
    if (key) {
      localesMap[key] = loadLocale as ImportLocaleFn;
    }
  }
  return localesMap;
}

/**
 * Load locale modules with directory structure
 * @param regexp - Regular expression to match language and file names
 * @param modules - The modules object containing paths and import functions
 * @returns A map of locales to their corresponding import functions
 */
function loadLocalesMapFromDir(
  regexp: RegExp,
  modules: Record<string, () => Promise<unknown>>,
): Record<Locale, ImportLocaleFn> {
  const localesRaw: Record<
    Locale,
    Record<string, () => Promise<unknown>>
  > = Object.create(null);
  const localesMap: Record<Locale, ImportLocaleFn> = Object.create(null);

  // Iterate over the modules to extract language and file names
  for (const [path, load] of Object.entries(modules)) {
    const match = path.match(regexp);
    if (match) {
      const [_, locale, fileName] = match;
      if (locale && fileName) {
        const files = (localesRaw[locale] ??= Object.create(null));
        files[fileName] = load;
      }
    }
  }

  // Convert raw locale data into async import functions
  for (const [locale, files] of Object.entries(localesRaw)) {
    localesMap[locale] = async () => ({
      default: Object.fromEntries(
        await Promise.all(
          Object.entries(files).map(async ([fileName, importFn]) => [
            fileName,
            ((await importFn()) as { default: unknown }).default,
          ]),
        ),
      ),
    });
  }

  return localesMap;
}

export function createMessageLoader(
  modules: Record<string, () => Promise<unknown>>,
): LoadMessageFn {
  const map = loadLocalesMapFromDir(/\.\/langs\/([^/]+)\/(.*)\.json$/, modules);
  return async (lang) => {
    const messages = await map[lang]?.();
    return messages?.default;
  };
}

function isNamespace(value: unknown): value is LocaleMessages {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  // Compiled Vue I18n messages (including the minified form) are leaves,
  // not namespaces. Replacing one must not retain nodes from its old AST.
  return (
    !('type' in value && value.type === 0 && 'body' in value) &&
    !('t' in value && value.t === 0 && 'b' in value)
  );
}

export function overlayMessages(
  shared: LocaleMessages,
  app: LocaleMessages,
): LocaleMessages {
  const result: LocaleMessages = { ...shared };
  for (const [key, value] of Object.entries(app)) {
    if (key === '__proto__' || key === 'constructor' || key === 'prototype')
      continue;
    const previous = result[key];
    result[key] =
      isNamespace(previous) && isNamespace(value)
        ? overlayMessages(previous, value)
        : value;
  }
  return result;
}

export { loadLocalesMap, loadLocalesMapFromDir };
