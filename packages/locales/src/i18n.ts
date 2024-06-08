import type { SupportedLanguagesType } from '@vben-core/typings';
import type { Locale } from 'vue-i18n';

import type { ImportLocaleFn } from './typing';

import { unref } from 'vue';
import { createI18n } from 'vue-i18n';

const loadedLanguages = new Set<string>();

const i18n = createI18n({
  globalInjection: true,
  legacy: false,
  locale: '',
  messages: {},
  missingWarn: import.meta.env.PROD,
  silentFallbackWarn: !import.meta.env.PROD,
  silentTranslationWarn: !import.meta.env.PROD, // true - warning off
});

const modules = import.meta.glob('./langs/*.y(a)?ml');

const localesMap: Record<Locale, ImportLocaleFn> = {};

for (const [path, loadLocale] of Object.entries(modules)) {
  const key = path.match(/([\w-]*)\.y(a)?ml/)?.[1];
  if (key) {
    localesMap[key] = loadLocale as ImportLocaleFn;
  }
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
async function loadLocaleMessages(lang: SupportedLanguagesType) {
  if (unref(i18n.global.locale) === lang) {
    return setI18nLanguage(lang);
  }

  if (loadedLanguages.has(lang)) {
    return setI18nLanguage(lang);
  }

  const messages = await localesMap[lang]();

  i18n.global.setLocaleMessage(lang, messages.default);
  loadedLanguages.add(lang);
  return setI18nLanguage(lang);
}

export { i18n, loadLocaleMessages, setI18nLanguage };
