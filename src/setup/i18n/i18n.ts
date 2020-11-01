import type { App } from 'vue';
import type { I18n, Locale } from 'vue-i18n';
import { createI18n } from 'vue-i18n';
import localeMessages from '/@/locales';
import { useLocale } from '/@/hooks/web/useLocale';

const { getLocale } = useLocale();

console.log(localeMessages);
const localeData = {
  legacy: false,
  locale: getLocale(),
  // TODO: setting fallback inside settings
  fallbackLocale: 'en',
  messages: {
    ...localeMessages,
  },
};

function setupI18n(app: App) {
  const i18n = createI18n(localeData) as I18n;
  setI18nLanguage(i18n, getLocale());

  app.use(i18n);
}

export function setI18nLanguage(i18n: I18n, locale: Locale): void {
  i18n.global.locale.value = locale;
}

export default setupI18n;
