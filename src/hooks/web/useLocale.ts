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
  async function changeLocale(locale: string): Promise<void> {
    appStore.commitProjectConfigState({ locale: locale });
  }

  return { getLocale, changeLocale };
}
