import type { ProjectConfig } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';
import { ContentEnum } from '/@/enums/appEnum';

type RootSetting = Omit<
  ProjectConfig,
  'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
>;
export function useRootSetting() {
  const getRootSetting = computed((): RootSetting => appStore.getProjectConfig);

  const getOpenPageLoading = computed(() => unref(getRootSetting).openPageLoading);

  const getPageLoading = computed(() => appStore.getPageLoading);

  const getOpenRouterTransition = computed(() => unref(getRootSetting).openRouterTransition);

  const getOpenKeepAlive = computed(() => unref(getRootSetting).openKeepAlive);

  const getRouterTransition = computed(() => unref(getRootSetting).routerTransition);

  const getCanEmbedIFramePage = computed(() => unref(getRootSetting).canEmbedIFramePage);

  const getPermissionMode = computed(() => unref(getRootSetting).permissionMode);

  const getShowLogo = computed(() => unref(getRootSetting).showLogo);

  const getContentMode = computed(() => unref(getRootSetting).contentMode);

  const getUseOpenBackTop = computed(() => unref(getRootSetting).useOpenBackTop);

  const getShowSettingButton = computed(() => unref(getRootSetting).showSettingButton);

  const getUseErrorHandle = computed(() => unref(getRootSetting).useErrorHandle);

  const getShowFooter = computed(() => unref(getRootSetting).showFooter);

  const getShowBreadCrumb = computed(() => unref(getRootSetting).showBreadCrumb);

  const getShowBreadCrumbIcon = computed(() => unref(getRootSetting).showBreadCrumbIcon);

  const getFullContent = computed(() => unref(getRootSetting).fullContent);

  const getColorWeak = computed(() => unref(getRootSetting).colorWeak);

  const getGrayMode = computed(() => unref(getRootSetting).grayMode);

  const getLayoutContentMode = computed(() =>
    unref(getRootSetting).contentMode === ContentEnum.FULL ? ContentEnum.FULL : ContentEnum.FIXED
  );

  function setRootSetting(setting: RootSetting) {
    appStore.commitProjectConfigState(setting);
  }

  return {
    setRootSetting,

    getFullContent,
    getColorWeak,
    getGrayMode,
    getRootSetting,
    getLayoutContentMode,
    getPageLoading,
    getOpenPageLoading,
    getOpenRouterTransition,
    getOpenKeepAlive,
    getRouterTransition,
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
  };
}
