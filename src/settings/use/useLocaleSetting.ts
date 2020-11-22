import type { LocaleSetting } from '/@/types/config';

import { computed } from 'vue';
import { appStore } from '/@/store/modules/app';

import getProjectSetting from '/@/settings/projectSetting';
import { localeList } from '/@/locales';

export function useLocaleSetting() {
  // Get locale configuration
  const getLocale = computed(() => {
    return appStore.getProjectConfig.locale || getProjectSetting.locale;
  });

  // get current language
  const getLang = computed(() => {
    return getLocale.value.lang;
  });

  // get Available Locales
  const getAvailableLocales = computed((): string[] => {
    return getLocale.value.availableLocales;
  });

  // get Fallback Locales
  const getFallbackLocale = computed((): string => {
    return getLocale.value.fallback;
  });

  // Set locale configuration
  function setLocale(locale: Partial<LocaleSetting>): void {
    appStore.commitProjectConfigState({ locale });
  }

  return { getLocale, getLang, localeList, setLocale, getAvailableLocales, getFallbackLocale };
}
