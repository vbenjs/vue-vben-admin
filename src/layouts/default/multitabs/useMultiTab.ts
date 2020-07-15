import {
  CLOSE_ALL,
  CLOSE_CURRENT,
  CLOSE_LEFT,
  CLOSE_OTHER,
  CLOSE_RIGHT,
  MenuEventEnum,
  REFRESH_PAGE,
  TabContentEnum,
  TabContentProps,
} from './tab.data';

import { Ref, computed, unref } from 'compatible-vue';
import { RouteConfigEx, RouteEx } from '@/router/types';
import { useGo, useRedo, useRouter } from '@/hooks/core/useRouter';
import { useTabs } from '@/hooks/functions/useTabs';

import { DropMenu } from '@/components/dropdown/index';
import { pageEnum } from '@/enums/pageEnum';
import { tabStore, TabItem } from '@/store/modules/tab';
import { permissionStore } from '@/store/modules/permission';

/**
 * @description: 过滤所有固定路由
 */
function filterAffixTabs(routes: RouteConfigEx[]) {
  let tabs: TabItem[] = [];
  routes &&
    routes.forEach((route) => {
      if (route.meta && route.meta.affix) {
        tabs.push({
          path: route.path,
          name: route.name,
          meta: { ...route.meta },
        });
      }
      if (route.children) {
        const tempTabs = filterAffixTabs(route.children);
        if (tempTabs.length >= 1) {
          tabs = [...tabs, ...tempTabs];
        }
      }
    });
  return tabs;
}
/**
 * @description: 设置固定tabs
 */
export function addAffixTabs(): void {
  const affixTabs = filterAffixTabs(permissionStore.getRoutesState);
  for (const tab of affixTabs) {
    tabStore.commitAddTab(tab);
  }
}

export function closeTab(closedTab: TabItem) {
  const { route } = useRouter();
  // 当前tab列表
  const getTabsState = computed(() => {
    return tabStore.getTabsState;
  });
  const { path } = unref(route);
  if (path !== closedTab.path) {
    // 关闭的不是激活tab
    tabStore.commitCloseTab(closedTab);
    return;
  }
  // 关闭的为激活atb
  let toPath: pageEnum | string;
  const index = unref(getTabsState).findIndex((item) => item.path === path);

  // 如果当前为最左边tab
  if (index === 0) {
    // 只有一个tab，则跳转至首页，否则跳转至右tab
    if (unref(getTabsState).length === 1) {
      toPath = pageEnum.BASE_HOME;
    } else {
      //  跳转至右边tab
      toPath = unref(getTabsState)[index + 1].path;
    }
  } else {
    // 跳转至左边tab
    toPath = unref(getTabsState)[index - 1].path;
  }
  tabStore.commitCloseTab(unref(route));

  useGo({ path: toPath as pageEnum, replace: true });
}

/**
 * @description: 右键下拉
 */
export function useTabDropdown(tabContentProps: TabContentProps) {
  const { route } = useRouter();
  const getCurrentTab: Ref<TabItem | RouteEx> = computed(() => {
    return tabContentProps.type === TabContentEnum.TAB_TYPE
      ? tabContentProps.tabItem
      : unref(route);
  });

  // 当前tab列表
  const getTabsState = computed(() => {
    return tabStore.getTabsState;
  });

  /**
   * @description: 下拉列表
   */
  const getDropMenuList = computed(() => {
    const dropMenuList = [
      REFRESH_PAGE,
      CLOSE_CURRENT,
      CLOSE_LEFT,
      CLOSE_RIGHT,
      CLOSE_OTHER,
      CLOSE_ALL,
    ];
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
    const { meta, path } = unref(getCurrentTab);
    // console.log(unref(getCurrentTab));

    // 当前为固定tab
    if (meta && meta.affix) {
      CLOSE_CURRENT.disabled = true;
    }
    if (path === unref(getTabsState)[0].path) {
      CLOSE_LEFT.disabled = true;
    }
    if (path === unref(getTabsState)[unref(getTabsState).length - 1].path) {
      CLOSE_RIGHT.disabled = true;
    }
    if (path !== unref(route).path) {
      REFRESH_PAGE.disabled = true;
    }

    return dropMenuList;
  });

  /**
   * @description: 关闭所有页面时，跳转页面
   */
  function gotoPage() {
    const len = unref(getTabsState).length;
    const { path } = unref(route);

    let toPath: pageEnum | string = pageEnum.BASE_HOME;

    if (len > 0) {
      toPath = unref(getTabsState)[len - 1].path;
    }
    // 跳到当前页面报错
    path !== toPath && useGo({ path: toPath as pageEnum, replace: true });
  }

  function isGotoPage(currentTab?: TabItem) {
    const { path } = unref(route);
    const currentPath = (currentTab || unref(getCurrentTab)).path;
    // 不是当前tab，关闭左侧/右侧时，需跳转页面
    if (path !== currentPath) {
      useGo({ path: currentPath as pageEnum, replace: true });
    }
  }
  function refreshPage(tabItem?: TabItem) {
    // const { route } = useRouter();
    tabStore.commitCloseTabKeepAlive(tabItem || unref(getCurrentTab));
    useRedo();
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
    closeTab(unref(tabItem || getCurrentTab));
  }
  const { initTabFn } = useTabs();
  initTabFn({
    refreshPageFn: refreshPage,
    closeAllFn: closeAll,
    closeCurrentFn: closeCurrent,
    closeLeftFn: closeLeft,
    closeOtherFn: closeOther,
    closeRightFn: closeRight,
  });
  // 处理右键事件
  function handleMenuEvent(menu: DropMenu): void {
    const { event } = menu;

    switch (event) {
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
