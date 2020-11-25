import type { AppRouteRecordRaw } from '/@/router/types';
import type { TabContentProps } from './data';
import type { Ref } from 'vue';
import type { TabItem } from '/@/store/modules/tab';
import type { DropMenu } from '/@/components/Dropdown';

import { computed, unref } from 'vue';
import { TabContentEnum, MenuEventEnum, getActions } from './data';
import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
import { PageEnum } from '/@/enums/pageEnum';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import router from '/@/router';
import { useTabs, isInitUseTab } from '/@/hooks/web/useTabs';
import { RouteLocationRaw } from 'vue-router';

const { initTabFn } = useTabs();

export function useTabDropdown(tabContentProps: TabContentProps) {
  const { currentRoute } = router;
  const redo = useRedo();
  const go = useGo();

  const isTabsRef = computed(() => tabContentProps.type === TabContentEnum.TAB_TYPE);
  const getCurrentTab: Ref<TabItem | AppRouteRecordRaw> = computed(() => {
    return unref(isTabsRef)
      ? tabContentProps.tabItem
      : ((unref(currentRoute) as any) as AppRouteRecordRaw);
  });

  // Current tab list
  const getTabsState = computed(() => tabStore.getTabsState);

  /**
   * @description: drop-down list
   */
  const getDropMenuList = computed(() => {
    const dropMenuList = getActions();
    // Reset to initial state
    for (const item of dropMenuList) {
      item.disabled = false;
    }

    // No tab
    if (!unref(getTabsState) || unref(getTabsState).length <= 0) {
      return dropMenuList;
    } else if (unref(getTabsState).length === 1) {
      // Only one tab
      for (const item of dropMenuList) {
        if (item.event !== MenuEventEnum.REFRESH_PAGE) {
          item.disabled = true;
        }
      }
      return dropMenuList;
    }
    if (!unref(getCurrentTab)) return;
    const { meta, path } = unref(getCurrentTab);

    // Refresh button
    const curItem = tabStore.getCurrentContextMenuState;
    const index = tabStore.getCurrentContextMenuIndexState;
    const refreshDisabled = curItem ? curItem.path !== path : true;
    // Close left
    const closeLeftDisabled = index === 0;

    // Close right
    const closeRightDisabled = index === unref(getTabsState).length - 1;
    // Currently fixed tab
    // TODO PERf
    dropMenuList[0].disabled = unref(isTabsRef) ? refreshDisabled : false;
    if (meta && meta.affix) {
      dropMenuList[1].disabled = true;
    }
    dropMenuList[2].disabled = closeLeftDisabled;
    dropMenuList[3].disabled = closeRightDisabled;

    return dropMenuList;
  });

  /**
   * @description: Jump to page when closing all pages
   */
  function gotoPage() {
    const len = unref(getTabsState).length;
    const { path } = unref(currentRoute);

    let toPath: PageEnum | string = PageEnum.BASE_HOME;

    if (len > 0) {
      const page = unref(getTabsState)[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }
    // Jump to the current page and report an error
    path !== toPath && go(toPath as PageEnum, true);
  }

  function isGotoPage(currentTab?: TabItem) {
    const { path } = unref(currentRoute);
    const currentPath = (currentTab || unref(getCurrentTab)).path;
    // Not the current tab, when you close the left/right side, you need to jump to the page
    if (path !== currentPath) {
      go(currentPath as PageEnum, true);
    }
  }
  function refreshPage(tabItem?: TabItem) {
    try {
      tabStore.commitCloseTabKeepAlive(tabItem || unref(getCurrentTab));
    } catch (error) {}
    redo();
  }

  function closeAll() {
    tabStore.commitCloseAllTab();
    gotoPage();
  }

  function closeLeft(tabItem?: TabItem) {
    tabStore.closeLeftTabAction(tabItem || unref(getCurrentTab));
    isGotoPage(tabItem);
  }

  function closeRight(tabItem?: TabItem) {
    tabStore.closeRightTabAction(tabItem || unref(getCurrentTab));
    isGotoPage(tabItem);
  }

  function closeOther(tabItem?: TabItem) {
    tabStore.closeOtherTabAction(tabItem || unref(getCurrentTab));
    isGotoPage(tabItem);
  }

  function closeCurrent(tabItem?: TabItem) {
    closeTab(unref(tabItem || unref(getCurrentTab)));
  }

  function scaleScreen() {
    const {
      headerSetting: { show: showHeader },
      menuSetting: { show: showMenu },
    } = appStore.getProjectConfig;
    const isScale = !showHeader && !showMenu;
    appStore.commitProjectConfigState({
      headerSetting: { show: isScale },
      menuSetting: { show: isScale },
    });
  }

  if (!isInitUseTab) {
    initTabFn({
      refreshPageFn: refreshPage,
      closeAllFn: closeAll,
      closeCurrentFn: closeCurrent,
      closeLeftFn: closeLeft,
      closeOtherFn: closeOther,
      closeRightFn: closeRight,
    });
  }

  // Handle right click event
  function handleMenuEvent(menu: DropMenu): void {
    const { event } = menu;

    switch (event) {
      case MenuEventEnum.SCALE:
        scaleScreen();
        break;
      case MenuEventEnum.REFRESH_PAGE:
        // refresh page
        refreshPage();
        break;
      // Close current
      case MenuEventEnum.CLOSE_CURRENT:
        closeCurrent();
        break;
      // Close left
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft();
        break;
      // Close right
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight();
        break;
      // Close other
      case MenuEventEnum.CLOSE_OTHER:
        closeOther();
        break;
      // Close all
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent };
}

export function getObj(tabItem: TabItem) {
  const { params, path, query } = tabItem;
  return {
    params: params || {},
    path,
    query: query || {},
  };
}

export function closeTab(closedTab: TabItem | AppRouteRecordRaw) {
  const { currentRoute, replace } = router;
  // Current tab list
  const getTabsState = computed(() => tabStore.getTabsState);

  const { path } = unref(currentRoute);
  if (path !== closedTab.path) {
    // Closed is not the activation tab
    tabStore.commitCloseTab(closedTab);
    return;
  }

  // Closed is activated atb
  let toObj: RouteLocationRaw = {};

  const index = unref(getTabsState).findIndex((item) => item.path === path);

  // If the current is the leftmost tab
  if (index === 0) {
    // There is only one tab, then jump to the homepage, otherwise jump to the right tab
    if (unref(getTabsState).length === 1) {
      toObj = PageEnum.BASE_HOME;
    } else {
      //  Jump to the right tab
      const page = unref(getTabsState)[index + 1];
      toObj = getObj(page);
    }
  } else {
    // Close the current tab
    const page = unref(getTabsState)[index - 1];
    toObj = getObj(page);
  }
  const route = (unref(currentRoute) as unknown) as AppRouteRecordRaw;
  tabStore.commitCloseTab(route);
  replace(toObj);
}
