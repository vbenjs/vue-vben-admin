import type { NDateLocale, NLocale } from 'naive-ui';

import type { App } from 'vue';

import type { LocaleSetupOptions } from '@vben/locales';

import {
  $t,
  setupI18n as coreSetup,
  createMessageLoader,
  createUiLocale,
  defineLocaleConfig,
} from '@vben/locales';
import { vxeLocaleAdapter, vxeLocales } from '@vben/plugins/vxe-table/locales';
import {
  preferences,
  preferencesManager,
  updatePreferences,
} from '@vben/preferences';

const { adapter: ui, locale: naiveLocale } = createUiLocale<{
  date: NDateLocale;
  ui: NLocale;
}>();

async function loadNaiveLocale(
  ui: Promise<{ default: NLocale }>,
  date: Promise<{ default: NDateLocale }>,
) {
  const [labels, dates] = await Promise.all([ui, date]);
  return { default: { ui: labels.default, date: dates.default } };
}

const localeConfig = defineLocaleConfig({
  adapters: { ui, vxe: vxeLocaleAdapter },
  languages: {
    'zh-CN': {
      label: '简体中文',
      resources: {
        ui: () =>
          loadNaiveLocale(
            import('naive-ui/es/locales/common/zhCN'),
            import('naive-ui/es/locales/date/zhCN'),
          ),
        vxe: vxeLocales['zh-CN'],
      },
    },
    'en-US': {
      label: 'English',
      resources: {
        ui: () =>
          loadNaiveLocale(
            import('naive-ui/es/locales/common/enUS'),
            import('naive-ui/es/locales/date/enUS'),
          ),
        vxe: vxeLocales['en-US'],
      },
    },
  },
  loadMessages: createMessageLoader(import.meta.glob('./langs/**/*.json')),
});

export type AppLocale = keyof typeof localeConfig.languages;

async function setupI18n(app: App, options: LocaleSetupOptions = {}) {
  await coreSetup(app, {
    ...localeConfig,
    defaultLocale: preferencesManager.getInitialPreferences().app.locale,
    initialLocale: preferences.app.locale,
    missingWarn: !import.meta.env.PROD,
    ...options,
    onLocaleChanged(locale) {
      if (preferences.app.locale !== locale) {
        updatePreferences({ app: { locale } });
      }
      return options.onLocaleChanged?.(locale);
    },
  });
}

export { $t, naiveLocale, setupI18n };
