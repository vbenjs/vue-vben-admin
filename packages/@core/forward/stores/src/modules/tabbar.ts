import type { TabItem } from '@vben-core/typings';
import type { RouteRecordNormalized, Router } from 'vue-router';

import { toRaw } from 'vue';

import { startProgress, stopProgress } from '@vben-core/toolkit';

import { acceptHMRUpdate, defineStore } from 'pinia';

interface TabsState {
  /**
   * @zh_CN 当前打开的标签页列表缓存
   */
  cachedTabs: Set<string>;
  /**
   * @zh_CN 需要排除缓存的标签页
   */
  excludeCachedTabs: Set<string>;
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
const useCoreTabbarStore = defineStore('core-tabbar', {
  actions: {
    /**
     * Close tabs in bulk
     */
    async _bulkCloseByPaths(paths: string[]) {
      this.tabs = this.tabs.filter((item) => {
        return !paths.includes(getTabPath(item));
      });

      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭标签页
     * @param tab
     */
    _close(tab: TabItem) {
      const { fullPath } = tab;
      if (isAffixTab(tab)) {
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
     * @zh_CN 添加标签页
     * @param routeTab
     */
    addTab(routeTab: TabItem) {
      const tab = cloneTab(routeTab);
      if (!isTabShown(tab)) {
        return;
      }

      const tabIndex = this.tabs.findIndex((tab) => {
        return getTabPath(tab) === getTabPath(routeTab);
      });

      if (tabIndex === -1) {
        this.tabs.push(tab);
      } else {
        // 页面已经存在，不重复添加选项卡，只更新选项卡参数
        const currentTab = toRaw(this.tabs)[tabIndex];
        this.tabs.splice(tabIndex, 1, { ...currentTab, ...tab });
      }
      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭所有标签页
     */
    async closeAllTabs(router: Router) {
      this.tabs = this.tabs.filter((tab) => isAffixTab(tab));
      await this._goToDefaultTab(router);
      this.updateCacheTab();
    },
    /**
     * @zh_CN 关闭左侧标签页
     * @param tab
     */
    async closeLeftTabs(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => getTabPath(item) === getTabPath(tab),
      );

      if (index < 1) {
        return;
      }

      const leftTabs = this.tabs.slice(0, index);
      const paths: string[] = [];

      for (const item of leftTabs) {
        if (!isAffixTab(item)) {
          paths.push(getTabPath(item));
        }
      }
      await this._bulkCloseByPaths(paths);
    },

    /**
     * @zh_CN 关闭其他标签页
     * @param tab
     */
    async closeOtherTabs(tab: TabItem) {
      const closePaths = this.tabs.map((item) => getTabPath(item));

      const paths: string[] = [];

      for (const path of closePaths) {
        if (path !== tab.fullPath) {
          const closeTab = this.tabs.find((item) => getTabPath(item) === path);
          if (!closeTab) {
            continue;
          }
          if (!isAffixTab(closeTab)) {
            paths.push(getTabPath(closeTab));
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
        (item) => getTabPath(item) === getTabPath(tab),
      );

      if (index >= 0 && index < this.tabs.length - 1) {
        const rightTabs = this.tabs.slice(index + 1, this.tabs.length);

        const paths: string[] = [];
        for (const item of rightTabs) {
          if (!isAffixTab(item)) {
            paths.push(getTabPath(item));
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
      if (getTabPath(currentRoute.value) !== getTabPath(tab)) {
        this._close(tab);
        this.updateCacheTab();
        return;
      }
      const index = this.getTabs.findIndex(
        (item) => getTabPath(item) === getTabPath(currentRoute.value),
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
      const index = this.tabs.findIndex((item) => getTabPath(item) === key);
      if (index === -1) {
        return;
      }

      await this.closeTab(this.tabs[index], router);
    },

    /**
     * @zh_CN 固定标签页
     * @param tab
     */
    async pinTab(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => getTabPath(item) === getTabPath(tab),
      );
      if (index !== -1) {
        tab.meta.affixTab = true;
        this.addTab(tab);
      }
    },
    /**
     * 刷新标签页
     */
    async refresh(router: Router) {
      const { currentRoute } = router;
      const { name } = currentRoute.value;

      this.excludeCachedTabs.add(name as string);
      this.renderRouteView = false;
      startProgress();

      await new Promise((resolve) => setTimeout(resolve, 200));

      this.excludeCachedTabs.delete(name as string);
      this.renderRouteView = true;
      stopProgress();
    },
    /**
     * 设置固定标签页
     * @param tabs
     */
    setAffixTabs(tabs: RouteRecordNormalized[]) {
      for (const tab of tabs) {
        tab.meta.affixTab = true;
        this.addTab(routeToTab(tab));
      }
    },
    /**
     * @zh_CN 取消固定标签页
     * @param tab
     */
    async unpinTab(tab: TabItem) {
      const index = this.tabs.findIndex(
        (item) => getTabPath(item) === getTabPath(tab),
      );

      if (index !== -1) {
        tab.meta.affixTab = false;
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
      this.cachedTabs = cacheMap;
    },
  },
  getters: {
    affixTabs(): TabItem[] {
      return this.tabs.filter((tab) => isAffixTab(tab));
    },
    getCachedTabs(): string[] {
      return [...this.cachedTabs];
    },
    getExcludeCachedTabs(): string[] {
      return [...this.excludeCachedTabs];
    },
    getTabs(): TabItem[] {
      const affixTabs = this.tabs.filter((tab) => isAffixTab(tab));
      const normalTabs = this.tabs.filter((tab) => !isAffixTab(tab));
      return [...affixTabs, ...normalTabs];
    },
  },
  persist: [
    // tabs不需要保存在localStorage
    {
      paths: ['tabs'],
      storage: sessionStorage,
    },
  ],
  state: (): TabsState => ({
    cachedTabs: new Set(),
    excludeCachedTabs: new Set(),
    renderRouteView: true,
    tabs: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useCoreTabbarStore, hot));
}

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

/**
 * @zh_CN 是否是固定标签页
 * @param tab
 */
function isAffixTab(tab: TabItem) {
  return tab.meta?.affixTab ?? false;
}

/**
 * @zh_CN 是否显示标签
 * @param tab
 */
function isTabShown(tab: TabItem) {
  return !tab.meta.hideInTab;
}

/**
 * @zh_CN 获取标签页路径
 * @param tab
 */
function getTabPath(tab: RouteRecordNormalized | TabItem) {
  return decodeURIComponent((tab as TabItem).fullPath || tab.path);
}

function routeToTab(route: RouteRecordNormalized) {
  return {
    meta: route.meta,
    name: route.name,
    path: route.path,
  } as TabItem;
}

export { useCoreTabbarStore };
