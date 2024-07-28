import type { Locale } from 'vue-i18n';

import type { ImportLocaleFn, SupportedLanguagesType } from './typing';

import { unref } from 'vue';
import { createI18n } from 'vue-i18n';

const loadedLanguages = new Set<string>();

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: '',
  messages: {},
});

const modules = import.meta.glob('./langs/*.json');

const localesMap = loadLocalesMap(modules);

/**
 * Load locale modules
 * @param modules
 */
function loadLocalesMap(modules: Record<string, () => Promise<unknown>>) {
  const localesMap: Record<Locale, ImportLocaleFn> = {};

  for (const [path, loadLocale] of Object.entries(modules)) {
    const key = path.match(/([\w-]*)\.(yaml|yml|json)/)?.[1];
    if (key) {
      localesMap[key] = loadLocale as ImportLocaleFn;
    }
  }

  return localesMap;
}

/**
 * Set i18n language
 * @param locale
 */
function setI18nLanguage(locale: Locale) {
  i18n.global.locale.value = locale;

  document?.querySelector('html')?.setAttribute('lang', locale);
}

/**
 * Load locale messages
 * @param lang
 */
async function loadI18nMessages(lang: SupportedLanguagesType) {
  if (unref(i18n.global.locale) === lang) {
    return setI18nLanguage(lang);
  }

  if (loadedLanguages.has(lang)) {
    return setI18nLanguage(lang);
  }

  const message = await localesMap[lang]();

  i18n.global.setLocaleMessage(lang, message.default);
  loadedLanguages.add(lang);
  return setI18nLanguage(lang);
}

export { i18n, loadI18nMessages, loadLocalesMap, setI18nLanguage };
