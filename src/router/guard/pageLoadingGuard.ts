import type { Router } from 'vue-router';
import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { getParams } from '/@/utils/helper/routeHelper';

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
  router.afterEach(async (to, from) => {
    const { openRouterTransition, openPageLoading } = appStore.getProjectConfig;
    const realToPath = to.path.replace(getParams(to), '');
    const realFormPath = from.path.replace(getParams(from), '');
    if (
      (!openRouterTransition && openPageLoading) ||
      isFirstLoad ||
      to.meta.afterCloseLoading ||
      realToPath === realFormPath
    ) {
      setTimeout(() => {
        appStore.commitPageLoadingState(false);
      }, 110);
      isFirstLoad = false;
    }

    return true;
  });
}
