import type { Router } from 'vue-router';
import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { unref } from 'vue';

const { getOpenPageLoading } = useTransitionSetting();
export function createPageLoadingGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (!userStore.getTokenState) {
      return true;
    }
    if (to.meta.loaded) {
      return true;
    }

    if (unref(getOpenPageLoading)) {
      appStore.setPageLoadingAction(true);
      return true;
    }

    return true;
  });
  router.afterEach(async () => {
    if (unref(getOpenPageLoading)) {
      setTimeout(() => {
        appStore.commitPageLoadingState(false);
      }, 220);
    }
    return true;
  });
}
