import { toRaw } from 'vue';

import { unref } from 'vue';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { PageEnum } from '/@/enums/pageEnum';

import store from '/@/store';
import router from '/@/router';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/constant';
import { RouteLocationNormalized, RouteLocationRaw } from 'vue-router';
import { getRoute } from '/@/router/helper/routeHelper';
import { useGo, useRedo } from '/@/hooks/web/usePage';
import { cloneDeep } from 'lodash-es';

const NAME = 'app-tab';

hotModuleUnregisterModule(NAME);

export const PAGE_LAYOUT_KEY = '__PAGE_LAYOUT__';

function isGotoPage() {
  const go = useGo();
  go(unref(router.currentRoute).path, true);
}

@Module({ namespaced: true, name: NAME, dynamic: true, store })
class Tab extends VuexModule {
  cachedMapState = new Map<string, string[]>();

  // tab list
  tabsState: RouteLocationNormalized[] = [];

  lastDragEndIndexState = 0;

  get getTabsState() {
    return this.tabsState;
  }

  get getCurrentTab(): RouteLocationNormalized {
    const route = unref(router.currentRoute);
    return this.tabsState.find((item) => item.path === route.path)!;
  }

  get getCachedMapState(): Map<string, string[]> {
    return this.cachedMapState;
  }

  get getLastDragEndIndexState(): number {
    return this.lastDragEndIndexState;
  }

  @Mutation
  commitClearCache(): void {
    this.cachedMapState = new Map();
  }

  @Mutation
  goToPage() {
    const go = useGo();
    const len = this.tabsState.length;
    const { path } = unref(router.currentRoute);

    let toPath: PageEnum | string = PageEnum.BASE_HOME;

    if (len > 0) {
      const page = this.tabsState[len - 1];
      const p = page.fullPath || page.path;
      if (p) {
        toPath = p;
      }
    }
    // Jump to the current page and report an error
    path !== toPath && go(toPath as PageEnum, true);
  }

  @Mutation
  commitCachedMapState(): void {
    const cacheMap = new Map<string, string[]>();

    const pageCacheSet = new Set<string>();
    this.tabsState.forEach((tab) => {
      const item = getRoute(tab);
      const needCache = !item.meta?.ignoreKeepAlive;
      if (!needCache) return;

      if (item.meta?.affix) {
        const name = item.name as string;
        pageCacheSet.add(name);
      } else if (item?.matched && needCache) {
        const matched = item?.matched;
        if (!matched) return;
        const len = matched.length;

        if (len < 2) return;

        for (let i = 0; i < matched.length; i++) {
          const key = matched[i].name as string;

          if (i < 2) {
            pageCacheSet.add(key);
          }
          if (i < len - 1) {
            const { meta, name } = matched[i + 1];
            if (meta && (meta.affix || needCache)) {
              const mapList = cacheMap.get(key) || [];
              if (!mapList.includes(name as string)) {
                mapList.push(name as string);
              }
              cacheMap.set(key, mapList);
            }
          }
        }
      }
    });

    cacheMap.set(PAGE_LAYOUT_KEY, Array.from(pageCacheSet));
    this.cachedMapState = cacheMap;
  }

  @Mutation
  commitTabRoutesState(route: RouteLocationNormalized) {
    const { path, fullPath, params, query } = route;

    let updateIndex = -1;
    // Existing pages, do not add tabs repeatedly
    const hasTab = this.tabsState.some((tab, index) => {
      updateIndex = index;
      return (tab.fullPath || tab.path) === (fullPath || path);
    });
    if (hasTab) {
      const curTab = toRaw(this.tabsState)[updateIndex];
      if (!curTab) return;
      curTab.params = params || curTab.params;
      curTab.query = query || curTab.query;
      curTab.fullPath = fullPath || curTab.fullPath;
      this.tabsState.splice(updateIndex, 1, curTab);
      return;
    }
    this.tabsState = cloneDeep([...this.tabsState, route]);
  }

  /**
   * @description: close tab
   */
  @Mutation
  commitCloseTab(route: RouteLocationNormalized): void {
    const { fullPath, meta: { affix } = {} } = route;
    if (affix) return;
    const index = this.tabsState.findIndex((item) => item.fullPath === fullPath);
    index !== -1 && this.tabsState.splice(index, 1);
  }

  @Mutation
  commitCloseAllTab(): void {
    this.tabsState = this.tabsState.filter((item) => {
      return item.meta && item.meta.affix;
    });
  }

  @Mutation
  commitResetState(): void {
    this.tabsState = [];
    this.cachedMapState = new Map();
  }

  @Mutation
  commitSortTabs({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }): void {
    const currentTab = this.tabsState[oldIndex];

    this.tabsState.splice(oldIndex, 1);
    this.tabsState.splice(newIndex, 0, currentTab);
    this.lastDragEndIndexState = this.lastDragEndIndexState + 1;
  }

  @Mutation
  closeMultipleTab({ pathList }: { pathList: string[] }): void {
    this.tabsState = toRaw(this.tabsState).filter((item) => !pathList.includes(item.fullPath));
  }

  @Action
  addTabAction(route: RouteLocationNormalized) {
    const { path, name } = route;
    // 404  The page does not need to add a tab
    if (
      path === PageEnum.ERROR_PAGE ||
      !name ||
      [REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)
    ) {
      return;
    }
    this.commitTabRoutesState(getRoute(route));

    this.commitCachedMapState();
  }

  @Mutation
  async commitRedoPage() {
    const route = router.currentRoute.value;
    for (const [key, value] of this.cachedMapState) {
      const index = value.findIndex((item) => item === (route.name as string));
      if (index === -1) {
        continue;
      }
      if (value.length === 1) {
        this.cachedMapState.delete(key);
        continue;
      }
      value.splice(index, 1);
      this.cachedMapState.set(key, value);
    }
    const redo = useRedo();
    await redo();
  }

  @Action
  closeAllTabAction() {
    this.commitCloseAllTab();
    this.commitClearCache();
    this.goToPage();
  }

  @Action
  closeTabAction(tab: RouteLocationNormalized) {
    function getObj(tabItem: RouteLocationNormalized) {
      const { params, path, query } = tabItem;
      return {
        params: params || {},
        path,
        query: query || {},
      };
    }
    const { currentRoute, replace } = router;

    const { path } = unref(currentRoute);
    if (path !== tab.path) {
      // Closed is not the activation tab
      this.commitCloseTab(tab);
      return;
    }

    // Closed is activated atb
    let toObj: RouteLocationRaw = {};

    const index = this.getTabsState.findIndex((item) => item.path === path);

    // If the current is the leftmost tab
    if (index === 0) {
      // There is only one tab, then jump to the homepage, otherwise jump to the right tab
      if (this.getTabsState.length === 1) {
        toObj = PageEnum.BASE_HOME;
      } else {
        //  Jump to the right tab
        const page = this.getTabsState[index + 1];
        toObj = getObj(page);
      }
    } else {
      // Close the current tab
      const page = this.getTabsState[index - 1];
      toObj = getObj(page);
    }
    this.commitCloseTab(currentRoute.value);
    replace(toObj);
  }

  @Action
  closeTabByKeyAction(key: string) {
    const index = this.tabsState.findIndex((item) => (item.fullPath || item.path) === key);
    index !== -1 && this.closeTabAction(this.tabsState[index]);
  }

  @Action
  closeLeftTabAction(route: RouteLocationNormalized): void {
    const index = this.tabsState.findIndex((item) => item.path === route.path);

    if (index > 0) {
      const leftTabs = this.tabsState.slice(0, index);
      const pathList: string[] = [];
      for (const item of leftTabs) {
        const affix = item.meta ? item.meta.affix : false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      this.closeMultipleTab({ pathList });
    }
    this.commitCachedMapState();
    isGotoPage();
  }

  @Action
  closeRightTabAction(route: RouteLocationNormalized): void {
    const index = this.tabsState.findIndex((item) => item.fullPath === route.fullPath);

    if (index >= 0 && index < this.tabsState.length - 1) {
      const rightTabs = this.tabsState.slice(index + 1, this.tabsState.length);

      const pathList: string[] = [];
      for (const item of rightTabs) {
        const affix = item.meta ? item.meta.affix : false;
        if (!affix) {
          pathList.push(item.fullPath);
        }
      }
      this.closeMultipleTab({ pathList });
    }
    this.commitCachedMapState();
    isGotoPage();
  }

  @Action
  closeOtherTabAction(route: RouteLocationNormalized): void {
    const closePathList = this.tabsState.map((item) => item.fullPath);
    const pathList: string[] = [];
    closePathList.forEach((path) => {
      if (path !== route.fullPath) {
        const closeItem = this.tabsState.find((item) => item.path === path);
        if (!closeItem) return;
        const affix = closeItem.meta ? closeItem.meta.affix : false;
        if (!affix) {
          pathList.push(closeItem.fullPath);
        }
      }
    });
    this.closeMultipleTab({ pathList });
    this.commitCachedMapState();
    isGotoPage();
  }
}
export const tabStore = getModule<Tab>(Tab);
