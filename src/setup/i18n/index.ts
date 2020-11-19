import type { App } from 'vue';
import type { I18n, Locale, I18nOptions } from 'vue-i18n';

import { createI18n } from 'vue-i18n';
import localeMessages from '/@/locales';
import { useLocale } from '/@/hooks/web/useLocale';

const { getLocale } = useLocale();

const localeData: I18nOptions = {
  legacy: false,
  locale: getLocale(),
  // TODO: setting fallback inside settings
  fallbackLocale: 'en',
  messages: localeMessages,
  // availableLocales: ['ru'],
  sync: true, //If you don’t want to inherit locale from global scope, you need to set sync of i18n component option to false.
  silentTranslationWarn: false, // true - warning off
  silentFallbackWarn: true,
};

let i18n: I18n;

// setup i18n instance with glob
export function setupI18n(app: App) {
  i18n = createI18n(localeData) as I18n;
  setI18nLanguage(getLocale());
  app.use(i18n);
}

export function setI18nLanguage(locale: Locale): void {
  // @ts-ignore
  i18n.global.locale.value = locale;
  // i18n.global.setLocaleMessage(locale, messages);
}
