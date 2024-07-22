import { type RouteLocationNormalized, useRoute, useRouter } from 'vue-router';

import { useCoreTabbarStore } from '@vben/stores';

export function useTabs() {
  const router = useRouter();
  const route = useRoute();
  const coreTabbarStore = useCoreTabbarStore();

  async function closeLeftTabs(tab?: RouteLocationNormalized) {
    await coreTabbarStore.closeLeftTabs(tab || route);
  }

  async function closeAllTabs() {
    await coreTabbarStore.closeAllTabs(router);
  }

  async function closeRightTabs(tab?: RouteLocationNormalized) {
    await coreTabbarStore.closeRightTabs(tab || route);
  }

  async function closeOtherTabs(tab?: RouteLocationNormalized) {
    await coreTabbarStore.closeOtherTabs(tab || route);
  }

  async function closeCurrentTab(tab?: RouteLocationNormalized) {
    await coreTabbarStore.closeTab(tab || route, router);
  }

  async function pinTab(tab?: RouteLocationNormalized) {
    await coreTabbarStore.pinTab(tab || route);
  }

  async function unpinTab(tab?: RouteLocationNormalized) {
    await coreTabbarStore.unpinTab(tab || route);
  }

  async function toggleTabPin(tab?: RouteLocationNormalized) {
    await coreTabbarStore.toggleTabPin(tab || route);
  }

  async function refreshTab() {
    await coreTabbarStore.refresh(router);
  }

  async function openTabInNewWindow(tab?: RouteLocationNormalized) {
    coreTabbarStore.openTabInNewWindow(tab || route);
  }

  async function closeTabByKey(key: string) {
    await coreTabbarStore.closeTabByKey(key, router);
  }

  async function setTabTitle(title: string) {
    coreTabbarStore.setUpdateTime();
    await coreTabbarStore.setTabTitle(route, title);
  }

  async function resetTabTitle() {
    coreTabbarStore.setUpdateTime();
    await coreTabbarStore.resetTabTitle(route);
  }

  /**
   * 获取操作是否禁用
   * @param tab
   */
  function getTabDisableState(tab: RouteLocationNormalized = route) {
    const tabs = coreTabbarStore.getTabs;
    const affixTabs = coreTabbarStore.affixTabs;
    const index = tabs.findIndex((item) => item.path === tab.path);

    const disabled = tabs.length <= 1;

    const { meta } = tab;
    const affixTab = meta?.affixTab ?? false;
    const isCurrentTab = route.path === tab.path;

    // 当前处于最左侧或者减去固定标签页的数量等于0
    const disabledCloseLeft =
      index === 0 || index - affixTabs.length <= 0 || !isCurrentTab;

    const disabledCloseRight = !isCurrentTab || index === tabs.length - 1;

    const disabledCloseOther =
      disabled || !isCurrentTab || tabs.length - affixTabs.length <= 1;
    return {
      disabledCloseAll: disabled,
      disabledCloseCurrent: !!affixTab || disabled,
      disabledCloseLeft,
      disabledCloseOther,
      disabledCloseRight,
      disabledRefresh: !isCurrentTab,
    };
  }

  return {
    closeAllTabs,
    closeCurrentTab,
    closeLeftTabs,
    closeOtherTabs,
    closeRightTabs,
    closeTabByKey,
    getTabDisableState,
    openTabInNewWindow,
    pinTab,
    refreshTab,
    resetTabTitle,
    setTabTitle,
    toggleTabPin,
    unpinTab,
  };
}
