import type { LocaleType } from '/@/locales/types';
import { appStore } from '/@/store/modules/app';

export function useLocale() {
  /**
   *
   */
  function getLocale(): string {
    return appStore.getProjectConfig.locale;
  }

  /**
   *
   * @param locale
   */
  async function changeLocale(locale: LocaleType): Promise<void> {
    appStore.commitProjectConfigState({ locale: locale });
  }

  return { getLocale, changeLocale };
}
