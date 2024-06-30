import type { LocaleSetupOptions, SupportedLanguagesType } from './typing';

import type { App } from 'vue';

import { i18n, loadI18nMessages } from './i18n';

const $t = i18n.global.t;

let loadThirdPartyMessage: (lang: SupportedLanguagesType) => Promise<void>;

async function loadLocaleMessages(lang: SupportedLanguagesType) {
  await loadI18nMessages(lang);
  await loadThirdPartyMessage(lang);
}

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  const { defaultLocale = 'zh-CN' } = options;
  // app可以自行扩展一些第三方库和组件库的国际化
  loadThirdPartyMessage = options.loadThirdPartyMessage || (async () => {});
  app.use(i18n);
  await loadLocaleMessages(defaultLocale);
}

export { $t, loadLocaleMessages, setupI18n };
export type { CompileError } from '@intlify/core-base';
export { useI18n } from 'vue-i18n';
