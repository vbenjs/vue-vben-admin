import type { Router } from 'vue-router';
import { tabStore } from '/@/store/modules/tab';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { getParams } from '/@/router/helper/routeHelper';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { unref } from 'vue';

const { getOpenPageLoading, getEnableTransition } = useTransitionSetting();
export function createPageLoadingGuard(router: Router) {
  let isFirstLoad = true;
  router.beforeEach(async (to) => {
    const { openKeepAlive, multiTabsSetting: { show } = {} } = appStore.getProjectConfig;
    if (!userStore.getTokenState) {
      return true;
    }

    if (!unref(getEnableTransition) && unref(getOpenPageLoading)) {
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
    const realToPath = to.path.replace(getParams(to), '');
    const realFormPath = from.path.replace(getParams(from), '');
    if (
      (!unref(getEnableTransition) && unref(getOpenPageLoading)) ||
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
