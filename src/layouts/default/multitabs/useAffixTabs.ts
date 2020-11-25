import { toRaw } from 'vue';
import router from '/@/router';
import { AppRouteRecordRaw } from '/@/router/types';
import { TabItem, tabStore } from '/@/store/modules/tab';

export function initAffixTabs() {
  /**
   * @description: Filter all fixed routes
   */
  function filterAffixTabs(routes: AppRouteRecordRaw[]) {
    const tabs: TabItem[] = [];
    routes &&
      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          tabs.push(toRaw(route) as TabItem);
        }
      });
    return tabs;
  }

  /**
   * @description: Set fixed tabs
   */
  function addAffixTabs(): void {
    const affixTabs = filterAffixTabs((router.getRoutes() as unknown) as AppRouteRecordRaw[]);
    for (const tab of affixTabs) {
      tabStore.commitAddTab(tab);
    }
  }
  let isAddAffix = false;
  if (!isAddAffix) {
    addAffixTabs();
    isAddAffix = true;
  }
}
