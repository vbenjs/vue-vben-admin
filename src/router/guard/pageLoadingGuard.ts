import type { Router } from 'vue-router';
import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';

export function createPageLoadingGuard(router: Router) {
  let isFirstLoad = true;
  router.beforeEach(async (to) => {
    const {
      openKeepAlive,
      openRouterTransition,
      openPageLoading,
      multiTabsSetting: { show } = {},
    } = appStore.getProjectConfig;
    if (!userStore.getTokenState) {
      return true;
    }
    if (!openRouterTransition && openPageLoading) {
      appStore.commitPageLoadingState(true);
      return true;
    }
    if (show && openKeepAlive && !isFirstLoad) {
      const tabList = tabStore.getTabsState;
      const isOpen = tabList.some((tab) => tab.path === to.path);
      appStore.setPageLoadingAction(!isOpen);
    } else {
      appStore.setPageLoadingAction(true);
    }
    return true;
  });
  router.afterEach(async () => {
    const { openRouterTransition, openPageLoading } = appStore.getProjectConfig;
    if ((!openRouterTransition && openPageLoading) || isFirstLoad) {
      appStore.commitPageLoadingState(false);
      isFirstLoad = false;
    }
    return true;
  });
}
