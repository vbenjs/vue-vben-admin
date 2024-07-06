import type {
  ImportLocaleFn,
  LoadMessageFn,
  LocaleSetupOptions,
  SupportedLanguagesType,
} from './typing';

import type { App } from 'vue';

import { i18n, loadI18nMessages, loadLocalesMap } from './i18n';

const $t = i18n.global.t;

let loadMessages: LoadMessageFn;

async function loadLocaleMessages(lang: SupportedLanguagesType) {
  const mergeMessage = await loadMessages(lang);
  await loadI18nMessages(lang);
  i18n.global.mergeLocaleMessage(lang, mergeMessage);
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  const { defaultLocale = 'zh-CN' } = options;
  // app可以自行扩展一些第三方库和组件库的国际化
  loadMessages = options.loadMessages || (async () => ({}));
  app.use(i18n);
  await loadLocaleMessages(defaultLocale);
}

export { $t, loadLocaleMessages, loadLocalesMap, setupI18n };
export { useI18n } from 'vue-i18n';
export type { Locale } from 'vue-i18n';
export type { ImportLocaleFn };
