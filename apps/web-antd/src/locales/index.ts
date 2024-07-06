import type { SupportedLanguagesType } from '@vben/types';
import type { Locale } from 'ant-design-vue/es/locale';

import { ref } from 'vue';

import { $t, loadLocalesMap, setupI18n } from '@vben-core/locales';

import defaultLocale from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';

const antdLocale = ref<Locale>(defaultLocale);

const modules = import.meta.glob('./langs/*.y(a)?ml');

const localesMap = loadLocalesMap(modules);

/**
 * 加载应用特有的语言包
 * @param lang
 */
async function loadMessages(lang: SupportedLanguagesType) {
  const [appLocaleMessages] = await Promise.all([
    localesMap[lang](),
    loadThirdPartyMessage(lang),
  ]);
  return appLocaleMessages.default;
}

/**
 * 加载第三方组件库的语言包
 * @param lang
 */
async function loadThirdPartyMessage(lang: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(lang), loadDayjsLocale(lang)]);
}

/**
 * 加载dayjs的语言包
 * @param lang
 */
async function loadDayjsLocale(lang: SupportedLanguagesType) {
  let locale;
  switch (lang) {
    case 'zh-CN': {
      locale = await import('dayjs/locale/zh-cn');
      break;
    }
    case 'en-US': {
      locale = await import('dayjs/locale/en');
      break;
    }
    // 默认使用英语
    default: {
      locale = await import('dayjs/locale/en');
    }
  }
  dayjs.locale(locale);
}

/**
 * 加载antd的语言包
 * @param lang
 */
async function loadAntdLocale(lang: SupportedLanguagesType) {
  switch (lang) {
    case 'zh-CN': {
      antdLocale.value = defaultLocale;
      break;
    }
    case 'en-US': {
      antdLocale.value = (await import(
        'ant-design-vue/es/locale/en_US'
      )) as unknown as Locale;
      break;
    }
  }
}

export { $t, antdLocale, loadMessages, setupI18n };
