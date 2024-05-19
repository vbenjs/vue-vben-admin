import type { App } from 'vue';

import { i18n, loadLocaleMessages } from './i18n';

import type { LocaleSetupOptions } from './typing';

const $t = i18n.global.t;

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  const { defaultLocale = 'zh-CN' } = options;
  app.use(i18n);
  await loadLocaleMessages(defaultLocale);
}

export { $t, loadLocaleMessages, setupI18n };
export type { CompileError } from '@intlify/core-base';
export { useI18n } from 'vue-i18n';
