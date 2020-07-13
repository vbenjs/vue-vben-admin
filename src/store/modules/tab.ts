import { unref } from 'compatible-vue';
import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators';

import { pageEnum } from '@/enums/pageEnum';
import { RouteEx, Meta } from '@/router/types';
import projectSetting from '@/settings/projectSetting';

import { useRouter } from '@/hooks/core/useRouter';

import store from '@/store';

/**
 * @description:  vuex Tab模块
 */
// declare namespace TabsStore {
export interface TabItem {
  path: string;
  name?: string | null;
  meta?: Meta;
}
/**
 * @description: tab状态
 */
export interface TabState {
  // 打开的tab列表
  tabsState: Array<TabItem>;
  // keep-alive的tab列表
  keepAliveTabsState: string[];
}
// }

@Module({ namespaced: true, name: 'tab', dynamic: true, store })
class Tab extends VuexModule implements TabState {
  // tab列表
  tabsState: TabItem[] = [];
  // 缓存列表
  keepAliveTabsState: string[] = [];

  /**
   * @description: 获取tabs
   */
  get getTabsState() {
    return this.tabsState;
  }

  /**
   * @description: 获取缓存的tab列表
   */
  get getKeepAliveTabsState() {
    return this.keepAliveTabsState;
  }

  get getCurrentTab(): TabItem {
    const { route } = useRouter();
    return this.tabsState.find((item) => item.path === unref(route).path)!;
  }

  @Mutation
  commitClearCache(): void {
    this.keepAliveTabsState = [];
  }

  /**
   * @description: add tab
   */
  @Mutation
  commitAddTab(route: RouteEx | TabItem): void {
    const { path, name, meta } = route;
    // 404  页面不需要添加tab
    if (path === pageEnum.ERROR_PAGE) {
      return;
    } else if (/\/redirect\//.test(path)) {
      return;
    }
    // 已经存在的页面，不重复添加tab
    const hasTab = this.tabsState.some((tab) => {
      return tab.path === path;
    });
    if (hasTab) {
      return;
    }

    this.tabsState.push({ path, name, meta });

    if (projectSetting.openKeepAlive && name) {
      const noKeepAlive = meta && meta.noKeepAlive;
      const hasName = this.keepAliveTabsState.includes(name);
      !noKeepAlive && !hasName && this.keepAliveTabsState.push(name);
    }
  }

  /**
   * @description: close tab
   */
  @Mutation
  commitCloseTab(route: RouteEx | TabItem): void {
    const { path, name, meta: { affix } = {} } = route;
    if (affix) {
      return;
    }

    const index = this.tabsState.findIndex((item) => item.path === path);
    index !== -1 && this.tabsState.splice(index, 1);

    if (projectSetting.openKeepAlive && name) {
      const i = this.keepAliveTabsState.findIndex((item) => item === name);
      i !== -1 && this.keepAliveTabsState.splice(i, 1);
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

  @Action({ rawError: true })
  closeLeftTabAction(route: RouteEx | TabItem): void {
    const index = this.tabsState.findIndex((item) => item.path === route.path);

    if (index > 0) {
      const leftTabs = this.tabsState.slice(0, index);
      for (const item of leftTabs) {
        this.commitCloseTab(item);
      }
    }
  }

  @Action({ rawError: true })
  closeRightTabAction(route: RouteEx | TabItem): void {
    const index = this.tabsState.findIndex((item) => item.path === route.path);

    if (index >= 0 && index < this.tabsState.length - 1) {
      const rightTabs = this.tabsState.slice(index + 1, this.tabsState.length);
      for (const item of rightTabs) {
        this.commitCloseTab(item);
      }
    }
  }

  @Action({ rawError: true })
  closeOtherTabAction(route: RouteEx | TabItem): void {
    const closePathList = this.tabsState.map((item) => item.path);
    closePathList.forEach((path) => {
      if (path !== route.path) {
        const closeItem = this.tabsState.find((item) => item.path === path);
        closeItem && this.commitCloseTab(closeItem);
      }
    });
  }
}
export { Tab };
export const tabStore = getModule<Tab>(Tab);
