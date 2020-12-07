/**
 * Multi-language related operations
 */
import type { LocaleType } from '/@/locales/types';

import { unref, ref } from 'vue';

import { getI18n } from '/@/setup/i18n';

import { useLocaleSetting } from '/@/hooks/setting/useLocaleSetting';

import moment from 'moment';

import 'moment/dist/locale/zh-cn';

moment.locale('zh-cn');

const antConfigLocaleRef = ref<any>(null);

export function useLocale() {
  const { getLang, getLocale, setLocale: setLocalSetting } = useLocaleSetting();

  // Switching the language will change the locale of useI18n
  // And submit to configuration modification
  function changeLocale(lang: LocaleType): void {
    (getI18n().global.locale as any).value = lang;
    setLocalSetting({ lang });
    // i18n.global.setLocaleMessage(locale, messages);

    switch (lang) {
      // Simplified Chinese
      case 'zh_CN':
        import('ant-design-vue/es/locale/zh_CN').then((locale) => {
          antConfigLocaleRef.value = locale.default;
        });

        moment.locale('cn');
        break;
      // English
      case 'en':
        import('ant-design-vue/es/locale/en_US').then((locale) => {
          antConfigLocaleRef.value = locale.default;
        });
        moment.locale('en-us');
        break;

      // other
      default:
        break;
    }
  }

  // initialization
  function setupLocale() {
    const lang = unref(getLang);
    lang && changeLocale(lang);
  }

  return {
    setupLocale,
    getLocale,
    getLang,
    changeLocale,
    antConfigLocale: antConfigLocaleRef,
  };
}
