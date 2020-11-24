import type { LocaleSetting } from '/@/types/config';

import { computed, unref } from 'vue';
import { appStore } from '/@/store/modules/app';

import getProjectSetting from '/@/settings/projectSetting';
import { localeList } from '/@/locales';

export function useLocaleSetting() {
  // Get locale configuration
  const getLocale = computed(() => appStore.getProjectConfig.locale || getProjectSetting.locale);

  // get current language
  const getLang = computed(() => unref(getLocale).lang);

  // get Available Locales
  const getAvailableLocales = computed((): string[] => unref(getLocale).availableLocales);

  // get Fallback Locales
  const getFallbackLocale = computed((): string => unref(getLocale).fallback);

  // Set locale configuration
  function setLocale(locale: Partial<LocaleSetting>): void {
    appStore.commitProjectConfigState({ locale });
  }

  return { getLocale, getLang, localeList, setLocale, getAvailableLocales, getFallbackLocale };
}
