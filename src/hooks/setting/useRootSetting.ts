import type { ProjectConfig } from '/#/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';
import { ContentEnum } from '/@/enums/appEnum';

type RootSetting = Omit<
  ProjectConfig,
  'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
>;

const getRootSetting = computed((): RootSetting => appStore.getProjectConfig);

const getPageLoading = computed(() => appStore.getPageLoading);

const getOpenKeepAlive = computed(() => unref(getRootSetting).openKeepAlive);

const getSettingButtonPosition = computed(() => unref(getRootSetting).settingButtonPosition);

const getCanEmbedIFramePage = computed(() => unref(getRootSetting).canEmbedIFramePage);

const getPermissionMode = computed(() => unref(getRootSetting).permissionMode);

const getShowLogo = computed(() => unref(getRootSetting).showLogo);

const getContentMode = computed(() => unref(getRootSetting).contentMode);

const getUseOpenBackTop = computed(() => unref(getRootSetting).useOpenBackTop);

const getShowSettingButton = computed(() => unref(getRootSetting).showSettingButton);

const getUseErrorHandle = computed(() => unref(getRootSetting).useErrorHandle);

const getShowFooter = computed(() => unref(getRootSetting).showFooter);

const getShowBreadCrumb = computed(() => unref(getRootSetting).showBreadCrumb);

const getThemeColor = computed(() => unref(getRootSetting).themeColor);

const getShowBreadCrumbIcon = computed(() => unref(getRootSetting).showBreadCrumbIcon);

const getFullContent = computed(() => unref(getRootSetting).fullContent);

const getColorWeak = computed(() => unref(getRootSetting).colorWeak);

const getGrayMode = computed(() => unref(getRootSetting).grayMode);

const getLockTime = computed(() => unref(getRootSetting).lockTime);

const getLayoutContentMode = computed(() =>
  unref(getRootSetting).contentMode === ContentEnum.FULL ? ContentEnum.FULL : ContentEnum.FIXED
);

function setRootSetting(setting: Partial<RootSetting>) {
  appStore.commitProjectConfigState(setting);
}

export function useRootSetting() {
  return {
    setRootSetting,

    getSettingButtonPosition,
    getFullContent,
    getColorWeak,
    getGrayMode,
    getRootSetting,
    getLayoutContentMode,
    getPageLoading,
    getOpenKeepAlive,
    getCanEmbedIFramePage,
    getPermissionMode,
    getShowLogo,
    getUseErrorHandle,
    getShowBreadCrumb,
    getShowBreadCrumbIcon,
    getUseOpenBackTop,
    getShowSettingButton,
    getShowFooter,
    getContentMode,
    getLockTime,
    getThemeColor,
  };
}
