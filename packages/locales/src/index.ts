import {
  cancelLocaleChange,
  changeLocale,
  i18n,
  loadLocaleMessages,
  setupI18n,
} from './i18n';

const $t = i18n.global.t.bind(i18n.global);
const $te = i18n.global.te.bind(i18n.global);

export {
  $t,
  $te,
  cancelLocaleChange,
  changeLocale,
  i18n,
  loadLocaleMessages,
  setupI18n,
};
export {
  createDayjsLocale,
  createUiLocale,
  defineLocaleAdapter,
  defineLocaleConfig,
} from './locale-configs';
export {
  createMessageLoader,
  loadLocalesMap,
  loadLocalesMapFromDir,
} from './message-loaders';
export {
  type ImportLocaleFn,
  type LocaleAdapter,
  type LocaleMessages,
  type LocaleSetupOptions,
  type SupportedLanguagesType,
} from './typing';
export type { CompileError } from '@intlify/core-base';

export { useI18n } from 'vue-i18n';

export type { Locale } from 'vue-i18n';
