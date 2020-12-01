import { App } from 'vue';
import type { I18n, I18nOptions } from 'vue-i18n';

import { createI18n } from 'vue-i18n';
import localeMessages from '/@/locales';
import { useLocale } from '/@/hooks/web/useLocale';
import projectSetting from '/@/settings/projectSetting';
const { setupLocale } = useLocale();

const { lang, availableLocales, fallback } = projectSetting?.locale;
const localeData: I18nOptions = {
  legacy: false,
  locale: lang,
  fallbackLocale: fallback,
  messages: localeMessages,
  availableLocales: availableLocales,
  sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
  silentTranslationWarn: true, // true - warning off
  missingWarn: false,
  silentFallbackWarn: true,
};

let i18n: I18n;

// setup i18n instance with glob
export function setupI18n(app: App) {
  i18n = createI18n(localeData) as I18n;
  setupLocale();
  app.use(i18n);
}

export function getI18n(): I18n {
  return i18n;
}
