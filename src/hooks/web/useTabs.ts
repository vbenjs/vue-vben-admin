import type { RouteLocationNormalized, Router } from 'vue-router';

import { useRouter } from 'vue-router';
import { unref } from 'vue';

import { useMultipleTabStore } from '/@/store/modules/multipleTab';
import { useAppStore } from '/@/store/modules/app';

enum TableActionEnum {
  REFRESH,
  CLOSE_ALL,
  CLOSE_LEFT,
  CLOSE_RIGHT,
  CLOSE_OTHER,
  CLOSE_CURRENT,
  CLOSE,
}

export function useTabs(_router?: Router) {
  const appStore = useAppStore();

  function canIUseTabs(): boolean {
    const { show } = appStore.getMultiTabsSetting;
    if (!show) {
      throw new Error('The multi-tab page is currently not open, please open it in the settings！');
    }
    return !!show;
  }

  const tabStore = useMultipleTabStore();
  const router = _router || useRouter();

  const { currentRoute } = router;

  function getCurrentTab() {
    const route = unref(currentRoute);
    return tabStore.getTabList.find((item) => item.path === route.path)!;
  }

  async function updateTabTitle(title: string, tab?: RouteLocationNormalized) {
    const canIUse = canIUseTabs;
    if (!canIUse) {
      return;
    }
    const targetTab = tab || getCurrentTab();
    await tabStore.setTabTitle(title, targetTab);
  }

  async function handleTabAction(action: TableActionEnum, tab?: RouteLocationNormalized) {
    const canIUse = canIUseTabs;
    if (!canIUse) {
      return;
    }
    const currentTab = getCurrentTab();
    switch (action) {
      case TableActionEnum.REFRESH:
        await tabStore.refreshPage(router);
        break;

      case TableActionEnum.CLOSE_ALL:
        await tabStore.closeAllTab(router);
        break;

      case TableActionEnum.CLOSE_LEFT:
        await tabStore.closeLeftTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_RIGHT:
        await tabStore.closeRightTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_OTHER:
        await tabStore.closeOtherTabs(currentTab, router);
        break;

      case TableActionEnum.CLOSE_CURRENT:
      case TableActionEnum.CLOSE:
        await tabStore.closeTab(tab || currentTab, router);
        break;
    }
  }

  return {
    refreshPage: () => handleTabAction(TableActionEnum.REFRESH),
    closeAll: () => handleTabAction(TableActionEnum.CLOSE_ALL),
    closeLeft: () => handleTabAction(TableActionEnum.CLOSE_LEFT),
    closeRight: () => handleTabAction(TableActionEnum.CLOSE_RIGHT),
    closeOther: () => handleTabAction(TableActionEnum.CLOSE_OTHER),
    closeCurrent: () => handleTabAction(TableActionEnum.CLOSE_CURRENT),
    close: (tab?: RouteLocationNormalized) => {
      handleTabAction(TableActionEnum.CLOSE, tab);
    },
    setTitle: (title: string, tab?: RouteLocationNormalized) => updateTabTitle(title, tab),
  };
}
