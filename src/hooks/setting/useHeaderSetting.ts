import type { HeaderSetting } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

import { useMultipleTabSetting } from '/@/hooks/setting/useMultipleTabSetting';
import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';

import { MenuModeEnum } from '/@/enums/menuEnum';

export function useHeaderSetting() {
  const { getShow: getShowMultipleTab } = useMultipleTabSetting();
  const { getMode, getSplit, getShowHeaderTrigger, getIsSidebarType } = useMenuSetting();
  const { getShowBreadCrumb, getShowLogo } = useRootSetting();

  // Get header configuration
  const getHeaderSetting = computed(() => appStore.getProjectConfig.headerSetting);

  const getShowDoc = computed(() => unref(getHeaderSetting).showDoc);

  const getTheme = computed(() => unref(getHeaderSetting).theme);

  const getShowRedo = computed(() => unref(getHeaderSetting).showRedo && unref(getShowMultipleTab));

  const getUseLockPage = computed(() => unref(getHeaderSetting).useLockPage);

  const getShowFullScreen = computed(() => unref(getHeaderSetting).showFullScreen);

  const getShowNotice = computed(() => unref(getHeaderSetting).showNotice);

  const getShowBread = computed(() => {
    return (
      unref(getMode) !== MenuModeEnum.HORIZONTAL && unref(getShowBreadCrumb) && !unref(getSplit)
    );
  });

  const getShowHeaderLogo = computed(() => {
    return unref(getShowLogo) && !unref(getIsSidebarType);
  });

  const getShowContent = computed(() => {
    return unref(getShowBread) || unref(getShowHeaderTrigger);
  });

  // Set header configuration
  function setHeaderSetting(headerSetting: Partial<HeaderSetting>): void {
    appStore.commitProjectConfigState({ headerSetting });
  }

  return {
    setHeaderSetting,

    getHeaderSetting,

    getShowDoc,
    getTheme,
    getShowRedo,
    getUseLockPage,
    getShowFullScreen,
    getShowNotice,
    getShowBread,
    getShowContent,
    getShowHeaderLogo,
  };
}
