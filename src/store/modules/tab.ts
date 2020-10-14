import { computed, toRaw } from 'vue';
import type { AppRouteRecordRaw, RouteMeta } from '/@/router/types.d';

import { unref } from 'vue';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { PageEnum } from '/@/enums/pageEnum';
import { appStore } from '/@/store/modules/app';

import store from '/@/store';
import router from '/@/router';
import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '/@/router/constant';
import { getCurrentTo } from '/@/utils/helper/routeHelper';

type CacheName = string | symbol | null | undefined;
/**
 * @description:  vuex Tab模块
 */
// declare namespace TabsStore {
export interface TabItem {
  fullPath: string;
  path?: string;
  params?: any;
  query?: any;
  name?: CacheName;
  meta?: RouteMeta;
}

const NAME = 'tab';
hotModuleUnregisterModule(NAME);

const getOpenKeepAliveRef = computed(() => appStore.getProjectConfig.openKeepAlive);

@Module({ namespaced: true, name: NAME, dynamic: true, store })
class Tab extends VuexModule {
  // tab列表
  tabsState: TabItem[] = [];
  // 缓存列表
  keepAliveTabsState: CacheName[] = [];

  currentContextMenuIndexState = -1;

  currentContextMenuState: TabItem | null = null;

  /**
   * @description: 获取tabs
   */
  get getTabsState() {
    return this.tabsState;
  }

  get getCurrentContextMenuIndexState() {
    return this.currentContextMenuIndexState;
  }

  get getCurrentContextMenuState() {
    return this.currentContextMenuState;
  }

  /**
   * @description: 获取缓存的tab列表
   */
  get getKeepAliveTabsState() {
    return this.keepAliveTabsState;
  }

  get getCurrentTab(): TabItem {
    const route = unref(router.currentRoute);
    return this.tabsState.find((item) => item.path === route.path)!;
  }

  @Mutation
  commitClearCache(): void {
    this.keepAliveTabsState = [];
  }

  @Mutation
  commitCurrentContextMenuIndexState(index: number): void {
    this.currentContextMenuIndexState = index;
  }

  @Mutation
  commitCurrentContextMenuState(item: TabItem): void {
    this.currentContextMenuState = item;
  }

  /**
   * @description: add tab
   */
  @Mutation
  commitAddTab(route: AppRouteRecordRaw | TabItem): void {
    const { path, name, meta, fullPath, params, query } = route as TabItem;
    // 404  页面不需要添加tab
    if (path === PageEnum.ERROR_PAGE) {
      return;
    } else if ([REDIRECT_ROUTE.name, PAGE_NOT_FOUND_ROUTE.name].includes(name as string)) {
      return;
    }

    // 已经存在的页面，不重复添加tab
    const hasTab = this.tabsState.some((tab) => {
      return tab.fullPath === fullPath;
    });
    if (hasTab) return;

    this.tabsState.push({ path, fullPath, name, meta, params, query });
    if (unref(getOpenKeepAliveRef) && name) {
      const noKeepAlive = meta && meta.ignoreKeepAlive;
      const hasName = this.keepAliveTabsState.includes(name);
      !noKeepAlive && !hasName && this.keepAliveTabsState.push(name);
    }
  }

  /**
   * @description: close tab
   */
  @Mutation
  commitCloseTab(route: AppRouteRecordRaw | TabItem): void {
    try {
      const { fullPath, name, meta: { affix } = {} } = route;
      if (affix) return;
      const index = this.tabsState.findIndex((item) => item.fullPath === fullPath);
      index !== -1 && this.tabsState.splice(index, 1);

      if (unref(getOpenKeepAliveRef) && name) {
        const i = this.keepAliveTabsState.findIndex((item) => item === name);
        i !== -1 && this.keepAliveTabsState.splice(i, 1);
      }
    } catch (error) {}
  }

  @Mutation
  commitCloseTabKeepAlive(route: AppRouteRecordRaw | TabItem): void {
    const { name } = route;
    if (unref(getOpenKeepAliveRef) && name) {
      const i = this.keepAliveTabsState.findIndex((item) => item === name);
      i !== -1 && toRaw(this.keepAliveTabsState).splice(i, 1);
    }
  }

  @Mutation
  commitCloseAllTab(): void {
    this.tabsState = this.tabsState.filter((item) => {
      return item.meta && item.meta.affix;
    });
    const names = this.tabsState.map((item) => item.name);
    this.keepAliveTabsState = names as string[];
  }

  @Mutation
  commitResetState(): void {
    this.tabsState = [];
    this.currentContextMenuState = null;
    this.currentContextMenuIndexState = -1;
    this.keepAliveTabsState = [];
  }

  @Mutation
  closeMultipleTab({ pathList, nameList }: { pathList: string[]; nameList: string[] }): void {
    this.tabsState = toRaw(this.tabsState).filter((item) => !pathList.includes(item.fullPath));
    if (unref(getOpenKeepAliveRef) && nameList) {
      this.keepAliveTabsState = toRaw(this.keepAliveTabsState).filter(
        (item) => !nameList.includes(item as string)
      );
    }
  }

  @Action
  closeLeftTabAction(route: AppRouteRecordRaw | TabItem): void {
    const index = this.tabsState.findIndex((item) => item.path === route.path);

    if (index > 0) {
      const leftTabs = this.tabsState.slice(0, index);
      const pathList: string[] = [];
      const nameList: string[] = [];
      for (const item of leftTabs) {
        const affix = item.meta ? item.meta.affix : false;
        if (!affix) {
          pathList.push(item.fullPath);
          nameList.push(item.name as string);
        }
      }
      this.closeMultipleTab({ pathList, nameList });
    }
  }

  @Action
  addTabByPathAction(): void {
    const toRoute = getCurrentTo();
    if (!toRoute) return;
    const { meta } = toRoute;
    if (meta && meta.affix) {
      return;
    }
    this.commitAddTab((toRoute as unknown) as AppRouteRecordRaw);
  }

  @Action
  closeRightTabAction(route: AppRouteRecordRaw | TabItem): void {
    const index = this.tabsState.findIndex((item) => item.fullPath === route.fullPath);

    if (index >= 0 && index < this.tabsState.length - 1) {
      const rightTabs = this.tabsState.slice(index + 1, this.tabsState.length);

      const pathList: string[] = [];
      const nameList: string[] = [];
      for (const item of rightTabs) {
        const affix = item.meta ? item.meta.affix : false;
        if (!affix) {
          pathList.push(item.fullPath);
          nameList.push(item.name as string);
        }
      }
      this.closeMultipleTab({ pathList, nameList });
    }
  }

  @Action
  closeOtherTabAction(route: AppRouteRecordRaw | TabItem): void {
    const closePathList = this.tabsState.map((item) => item.fullPath);
    const pathList: string[] = [];
    const nameList: string[] = [];
    closePathList.forEach((path) => {
      if (path !== route.fullPath) {
        const closeItem = this.tabsState.find((item) => item.path === path);
        if (!closeItem) return;
        const affix = closeItem.meta ? closeItem.meta.affix : false;
        if (!affix) {
          pathList.push(closeItem.fullPath);
          nameList.push(closeItem.name as string);
        }
      }
    });
    this.closeMultipleTab({ pathList, nameList });
  }
}
export { Tab };
export const tabStore = getModule<Tab>(Tab);
