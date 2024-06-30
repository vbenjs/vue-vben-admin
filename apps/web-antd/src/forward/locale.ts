import type { SupportedLanguagesType } from '@vben/types';
import type { Locale } from 'ant-design-vue/es/locale';

import { ref } from 'vue';

import defaultLocale from 'ant-design-vue/es/locale/zh_CN';
import dayjs from 'dayjs';

const antdLocale = ref<Locale>(defaultLocale);

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
    default: {
      locale = await import('dayjs/locale/en');
    } // 默认使用英语
  }
  dayjs.locale(locale);
}

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

async function loadThirdPartyMessage(land: SupportedLanguagesType) {
  await Promise.all([loadAntdLocale(land), loadDayjsLocale(land)]);
}

export { antdLocale, loadThirdPartyMessage };
