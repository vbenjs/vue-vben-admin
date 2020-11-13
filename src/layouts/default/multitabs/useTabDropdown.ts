import type { AppRouteRecordRaw } from '/@/router/types';
import type { TabContentProps } from './tab.data';
import type { Ref } from 'vue';
import type { TabItem } from '/@/store/modules/tab';
import type { DropMenu } from '/@/components/Dropdown';

import { computed, unref } from 'vue';
import { TabContentEnum, MenuEventEnum, getActions } from './tab.data';
import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
import { PageEnum } from '/@/enums/pageEnum';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import router from '/@/router';
import { useTabs, isInitUseTab } from '/@/hooks/web/useTabs';
import { RouteLocationRaw } from 'vue-router';

const { initTabFn } = useTabs();
/**
 * @description: 右键下拉
 */
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

  // 当前tab列表
  const getTabsState = computed(() => {
    return tabStore.getTabsState;
  });

  /**
   * @description: 下拉列表
   */
  const getDropMenuList = computed(() => {
    const dropMenuList = getActions();
    // 重置为初始状态
    for (const item of dropMenuList) {
      item.disabled = false;
    }

    // 没有tab
    if (!unref(getTabsState) || unref(getTabsState).length <= 0) {
      return dropMenuList;
    } else if (unref(getTabsState).length === 1) {
      // 只有一个tab
      for (const item of dropMenuList) {
        if (item.event !== MenuEventEnum.REFRESH_PAGE) {
          item.disabled = true;
        }
      }
      return dropMenuList;
    }
    if (!unref(getCurrentTab)) {
      return;
    }
    const { meta, path } = unref(getCurrentTab);
    // console.log(unref(getCurrentTab));

    // 刷新按钮
    const curItem = tabStore.getCurrentContextMenuState;
    const index = tabStore.getCurrentContextMenuIndexState;
    const refreshDisabled = curItem ? curItem.path !== path : true;
    // 关闭左侧
    const closeLeftDisabled = index === 0;

    // 关闭右侧
    const closeRightDisabled = index === unref(getTabsState).length - 1;
    // 当前为固定tab
    dropMenuList[0].disabled = unref(isTabsRef) ? refreshDisabled : false;
    if (meta && meta.affix) {
      dropMenuList[1].disabled = true;
    }
    dropMenuList[2].disabled = closeLeftDisabled;
    dropMenuList[3].disabled = closeRightDisabled;

    return dropMenuList;
  });

  /**
   * @description: 关闭所有页面时，跳转页面
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
    // 跳到当前页面报错
    path !== toPath && go(toPath as PageEnum, true);
  }

  function isGotoPage(currentTab?: TabItem) {
    const { path } = unref(currentRoute);
    const currentPath = (currentTab || unref(getCurrentTab)).path;
    // 不是当前tab，关闭左侧/右侧时，需跳转页面
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

  // 处理右键事件
  function handleMenuEvent(menu: DropMenu): void {
    const { event } = menu;

    switch (event) {
      case MenuEventEnum.SCALE:
        scaleScreen();
        break;
      case MenuEventEnum.REFRESH_PAGE:
        // 刷新页面
        refreshPage();
        break;
      // 关闭当前
      case MenuEventEnum.CLOSE_CURRENT:
        closeCurrent();
        break;
      // 关闭左侧
      case MenuEventEnum.CLOSE_LEFT:
        closeLeft();
        break;
      // 关闭右侧
      case MenuEventEnum.CLOSE_RIGHT:
        closeRight();
        break;
      // 关闭其他
      case MenuEventEnum.CLOSE_OTHER:
        closeOther();
        break;
      // 关闭其他
      case MenuEventEnum.CLOSE_ALL:
        closeAll();
        break;
      default:
        break;
    }
  }
  return { getDropMenuList, handleMenuEvent };
}
export function closeTab(closedTab: TabItem | AppRouteRecordRaw) {
  const { currentRoute, replace } = router;
  // 当前tab列表
  const getTabsState = computed(() => {
    return tabStore.getTabsState;
  });
  const { path } = unref(currentRoute);
  if (path !== closedTab.path) {
    // 关闭的不是激活tab
    tabStore.commitCloseTab(closedTab);
    return;
  }
  // 关闭的为激活atb
  let toObj: RouteLocationRaw = {};
  const index = unref(getTabsState).findIndex((item) => item.path === path);

  // 如果当前为最左边tab
  if (index === 0) {
    // 只有一个tab，则跳转至首页，否则跳转至右tab
    if (unref(getTabsState).length === 1) {
      toObj = PageEnum.BASE_HOME;
    } else {
      //  跳转至右边tab
      const page = unref(getTabsState)[index + 1];
      const { params, path, query } = page;
      toObj = {
        params,
        path,
        query,
      };
    }
  } else {
    // 跳转至左边tab
    const page = unref(getTabsState)[index - 1];
    const { params, path, query } = page;
    toObj = {
      params: params || {},
      path,
      query: query || {},
    };
  }
  const route = (unref(currentRoute) as unknown) as AppRouteRecordRaw;
  tabStore.commitCloseTab(route);
  replace(toObj);
}
