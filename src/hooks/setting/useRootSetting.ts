import type { ProjectConfig } from '/@/types/config';

import { computed, unref } from 'vue';

import { appStore } from '/@/store/modules/app';

type RootSetting = Omit<
  ProjectConfig,
  'locale' | 'headerSetting' | 'menuSetting' | 'multiTabsSetting'
>;
export function useRootSetting() {
  const getRootSetting = computed((): RootSetting => appStore.getProjectConfig);

  const getOpenPageLoading = computed(() => unref(getRootSetting).openPageLoading);

  const getOpenRouterTransition = computed(() => unref(getRootSetting).openRouterTransition);

  const getOpenKeepAlive = computed(() => unref(getRootSetting).openKeepAlive);

  const getRouterTransition = computed(() => unref(getRootSetting).routerTransition);

  const getCanEmbedIFramePage = computed(() => unref(getRootSetting).canEmbedIFramePage);

  const getPermissionMode = computed(() => unref(getRootSetting).permissionMode);

  const getShowLogo = computed(() => unref(getRootSetting).showLogo);

  const getUseErrorHandle = computed(() => unref(getRootSetting).useErrorHandle);

  const getShowBreadCrumb = computed(() => unref(getRootSetting).showBreadCrumb);

  const getShowBreadCrumbIcon = computed(() => unref(getRootSetting).showBreadCrumbIcon);

  function setRootSetting(setting: RootSetting) {
    appStore.commitProjectConfigState(setting);
  }

  return {
    setRootSetting,

    getRootSetting,
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
  };
}
