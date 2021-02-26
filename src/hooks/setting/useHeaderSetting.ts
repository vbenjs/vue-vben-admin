import type { HeaderSetting } from '/#/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
import { useRootSetting } from '/@/hooks/setting/useRootSetting';
import { useFullContent } from '/@/hooks/web/useFullContent';

import { MenuModeEnum } from '/@/enums/menuEnum';

const { getFullContent } = useFullContent();
const {
  getMenuMode,
  getSplit,
  getShowHeaderTrigger,
  getIsSidebarType,
  getIsMixSidebar,
  getIsTopMenu,
} = useMenuSetting();
const { getShowBreadCrumb, getShowLogo } = useRootSetting();

const getShowMixHeaderRef = computed(() => !unref(getIsSidebarType) && unref(getShowHeader));

const getShowFullHeaderRef = computed(() => {
  return (
    !unref(getFullContent) &&
    unref(getShowMixHeaderRef) &&
    unref(getShowHeader) &&
    !unref(getIsTopMenu) &&
    !unref(getIsMixSidebar)
  );
});

const getShowInsetHeaderRef = computed(() => {
  const need = !unref(getFullContent) && unref(getShowHeader);
  return (
    (need && !unref(getShowMixHeaderRef)) ||
    (need && unref(getIsTopMenu)) ||
    (need && unref(getIsMixSidebar))
  );
});

// Get header configuration
const getHeaderSetting = computed(() => appStore.getProjectConfig.headerSetting);

const getShowDoc = computed(() => unref(getHeaderSetting).showDoc);

const getHeaderTheme = computed(() => unref(getHeaderSetting).theme);

const getShowHeader = computed(() => unref(getHeaderSetting).show);

const getFixed = computed(() => unref(getHeaderSetting).fixed);

const getHeaderBgColor = computed(() => unref(getHeaderSetting).bgColor);

const getShowSearch = computed(() => unref(getHeaderSetting).showSearch);

const getUseLockPage = computed(() => unref(getHeaderSetting).useLockPage);

const getShowFullScreen = computed(() => unref(getHeaderSetting).showFullScreen);

const getShowNotice = computed(() => unref(getHeaderSetting).showNotice);

const getUnFixedAndFull = computed(() => !unref(getFixed) && !unref(getShowFullHeaderRef));

const getShowBread = computed(() => {
  return (
    unref(getMenuMode) !== MenuModeEnum.HORIZONTAL && unref(getShowBreadCrumb) && !unref(getSplit)
  );
});

const getShowHeaderLogo = computed(() => {
  return unref(getShowLogo) && !unref(getIsSidebarType) && !unref(getIsMixSidebar);
});

const getShowContent = computed(() => {
  return unref(getShowBread) || unref(getShowHeaderTrigger);
});

// Set header configuration
function setHeaderSetting(headerSetting: Partial<HeaderSetting>): void {
  appStore.commitProjectConfigState({ headerSetting });
}

export function useHeaderSetting() {
  return {
    setHeaderSetting,

    getHeaderSetting,

    getShowDoc,
    getShowSearch,
    getHeaderTheme,
    getUseLockPage,
    getShowFullScreen,
    getShowNotice,
    getShowBread,
    getShowContent,
    getShowHeaderLogo,
    getShowHeader,
    getFixed,
    getShowMixHeaderRef,
    getShowFullHeaderRef,
    getShowInsetHeaderRef,
    getUnFixedAndFull,
    getHeaderBgColor,
  };
}
