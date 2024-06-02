import { startProgress, stopProgress } from '@vben-core/toolkit';
import { TabItem } from '@vben-core/typings';
import type { RouteRecordNormalized, Router } from 'vue-router';

import { acceptHMRUpdate, defineStore } from 'pinia';
import { toRaw } from 'vue';

/**
 * @zh_CN 克隆路由,防止路由被修改
 * @param route
 */
function cloneTab(route: TabItem): TabItem {
  if (!route) {
    return route;
  }
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}

function routeToTab(route: RouteRecordNormalized) {
  return {
    meta: route.meta,
    name: route.name,
    path: route.path,
  } as unknown as TabItem;
}

interface TabsState {
  /**
   * @zh_CN 固定的标签页列表
   */
  affixTabs: RouteRecordNormalized[];
  /**
   * @zh_CN 当前打开的标签页列表缓存
   */
  cacheTabs: Set<string>;
  /**
   * @zh_CN 需要排除缓存的标签页
   */
  excludeCacheTabs: Set<string>;
  /**
   * @zh_CN 是否刷新
   */
  renderRouteView?: boolean;
  /**
   * @zh_CN 当前打开的标签页列表
   */
  tabs: TabItem[];
}

/**
 * @zh_CN 访问权限相关
 */
const useTabsStore = defineStore('tabs', {
  actions: {
    /**
     * Close tabs in bulk
     */
    async _bulkCloseByPaths(paths: string[]) {
      this.tabs = this.tabs.filter((item) => {
        return !paths.includes(this.getTabPath(item));
      });

      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭标签页
     * @param tab
     */
    _close(tab: TabItem) {
      const { fullPath } = tab;
      if (this._isAffixTab(tab)) {
        return;
      }
      const index = this.tabs.findIndex((item) => item.fullPath === fullPath);
      index !== -1 && this.tabs.splice(index, 1);
    },
    /**
     * @zh_CN 跳转到默认标签页
     */
    async _goToDefaultTab(router: Router) {
      if (this.getTabs.length <= 0) {
        // TODO: 跳转首页
        return;
      }
      const firstTab = this.getTabs[0];
      await this._goToTab(firstTab, router);
    },
    /**
     * @zh_CN 跳转到标签页
     * @param tab
     */
    async _goToTab(tab: TabItem, router: Router) {
      const { params, path, query } = tab;
      const toParams = {
        params: params || {},
        path,
        query: query || {},
      };
      await router.replace(toParams);
    },
    /**
     * @zh_CN 是否是固定标签页
     * @param tab
     */
    _isAffixTab(tab: TabItem) {
      return tab?.meta?.affixTab ?? false;
    },
    /**
     * @zh_CN 添加标签页
     * @param routeTab
     */
    addTab(routeTab: TabItem) {
      const tab = cloneTab(routeTab);
      const { fullPath, meta, params, query } = tab;
      if (meta?.hideInTab) {
        return;
      }

      const tabIndex = this.tabs.findIndex((tab) => {
        return this.getTabPath(tab) === this.getTabPath(routeTab);
      });

      if (tabIndex === -1) {
        this.tabs.push(tab);
      } else {
        // 页面已经存在，不重复添加选项卡，只更新选项卡参数
        const currentTab = toRaw(this.tabs)[tabIndex];
        if (!currentTab) {
          return;
        }
        currentTab.params = params || currentTab.params;
        currentTab.query = query || currentTab.query;
        currentTab.fullPath = fullPath || currentTab.fullPath;
        this.tabs.splice(tabIndex, 1, currentTab);
      }
      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭所有标签页
     */
    async closeAllTabs(router: Router) {
      this.tabs = this.tabs.filter((tab) => this._isAffixTab(tab));
      await this._goToDefaultTab(router);
      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭左侧标签页
     * @param tab
     */
    async closeLeftTabs(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => this.getTabPath(item) === this.getTabPath(tab),
      );

      if (index > 0) {
        const leftTabs = this.tabs.slice(0, index);
        const paths: string[] = [];
        for (const item of leftTabs) {
          if (!this._isAffixTab(tab)) {
            paths.push(this.getTabPath(item));
          }
        }
        await this._bulkCloseByPaths(paths);
      }
    },

    /**
     * @zh_CN 关闭其他标签页
     * @param tab
     */
    async closeOtherTabs(tab: TabItem) {
      const closePaths = this.tabs.map((item) => this.getTabPath(item));

      const paths: string[] = [];

      for (const path of closePaths) {
        if (path !== tab.fullPath) {
          const closeTab = this.tabs.find(
            (item) => this.getTabPath(item) === path,
          );
          if (!closeTab) {
            continue;
          }
          if (!this._isAffixTab(tab)) {
            paths.push(this.getTabPath(closeTab));
          }
        }
      }
      await this._bulkCloseByPaths(paths);
    },

    /**
     * @zh_CN 关闭右侧标签页
     * @param tab
     */
    async closeRightTabs(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => this.getTabPath(item) === this.getTabPath(tab),
      );

      if (index >= 0 && index < this.tabs.length - 1) {
        const rightTabs = this.tabs.slice(index + 1, this.tabs.length);

        const paths: string[] = [];
        for (const item of rightTabs) {
          if (!this._isAffixTab(tab)) {
            paths.push(this.getTabPath(item));
          }
        }
        await this._bulkCloseByPaths(paths);
      }
    },

    /**
     * @zh_CN 关闭标签页
     * @param tab
     * @param router
     */
    async closeTab(tab: TabItem, router: Router) {
      const { currentRoute } = router;

      // 关闭不是激活选项卡
      if (this.getTabPath(currentRoute.value) !== this.getTabPath(tab)) {
        this._close(tab);
        this.updateCacheTab();
        return;
      }
      const index = this.getTabs.findIndex(
        (item) => this.getTabPath(item) === this.getTabPath(currentRoute.value),
      );

      const before = this.getTabs[index - 1];
      const after = this.getTabs[index + 1];

      // 下一个tab存在，跳转到下一个
      if (after) {
        this._close(currentRoute.value);
        await this._goToTab(after, router);
        // 上一个tab存在，跳转到上一个
      } else if (before) {
        this._close(currentRoute.value);
        await this._goToTab(before, router);
      } else {
        console.error('Failed to close the tab; only one tab remains open.');
      }
    },
    /**
     * @zh_CN 通过key关闭标签页
     * @param key
     */
    async closeTabByKey(key: string, router: Router) {
      const index = this.tabs.findIndex(
        (item) => this.getTabPath(item) === key,
      );
      if (index === -1) {
        return;
      }

      await this.closeTab(this.tabs[index], router);
    },
    getTabPath(tab: RouteRecordNormalized | TabItem) {
      return decodeURIComponent((tab as TabItem).fullPath || tab.path);
    },
    /**
     * @zh_CN 固定标签页
     * @param tab
     */
    async pushPinTab(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => this.getTabPath(item) === this.getTabPath(tab),
      );
      if (index !== -1) {
        this.tabs[index].meta.affixTab = true;
      }
      // TODO: 这里应该把tab从tbs中移除
      this.affixTabs.push(tab as unknown as RouteRecordNormalized);
    },
    /**
     * 刷新标签页
     */
    async refreshTab(router: Router) {
      const { currentRoute } = router;
      const { name } = currentRoute.value;

      this.excludeCacheTabs.add(name as string);
      this.renderRouteView = false;
      startProgress();

      await new Promise((resolve) => setTimeout(resolve, 200));

      this.excludeCacheTabs.delete(name as string);
      this.renderRouteView = true;
      stopProgress();
    },
    /**
     * 设置固定标签页
     * @param tabs
     */
    setAffixTabs(tabs: RouteRecordNormalized[]) {
      for (const tab of tabs) {
        this.addTab(routeToTab(tab));
      }
      this.affixTabs = tabs;
    },
    /**
     * @zh_CN 取消固定标签页
     * @param tab
     */
    async unPushPinTab(tab: TabItem) {
      const index = this.affixTabs.findIndex(
        (item) => this.getTabPath(item) === this.getTabPath(tab),
      );

      if (index !== -1) {
        this.affixTabs[index].meta.affixTab = false;
        this.affixTabs.splice(index, 1);
        this.addTab(tab);
      }
    },

    /**
     * 根据当前打开的选项卡更新缓存
     */
    async updateCacheTab() {
      const cacheMap = new Set<string>();

      for (const tab of this.tabs) {
        // 跳过不需要持久化的标签页
        const keepAlive = tab.meta?.keepAlive;
        if (!keepAlive) {
          continue;
        }
        tab.matched.forEach((t, i) => {
          if (i > 0) {
            cacheMap.add(t.name as string);
          }
        });

        const name = tab.name as string;
        cacheMap.add(name);
      }
      this.cacheTabs = cacheMap;
    },
  },
  getters: {
    getCacheTabs(): string[] {
      return [...this.cacheTabs];
    },
    getExcludeTabs(): string[] {
      return [...this.excludeCacheTabs];
    },

    getTabs(): TabItem[] {
      const tabs: TabItem[] = [];
      const affixTabPaths = new Set<string>();
      for (const tab of this.affixTabs) {
        if (!tab.meta.hideInTab) {
          tabs.push(routeToTab(tab));
          affixTabPaths.add(tab.path);
        }
      }
      for (const tab of this.tabs) {
        if (!affixTabPaths.has(tab.path) && !tab.meta.hideInTab) {
          tabs.push(tab);
        }
      }
      return tabs;
    },
  },
  persist: {
    // 持久化
    paths: [],
  },
  state: (): TabsState => ({
    affixTabs: [],
    cacheTabs: new Set(),
    excludeCacheTabs: new Set(),
    renderRouteView: true,
    tabs: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useTabsStore, hot));
}

export { useTabsStore };
