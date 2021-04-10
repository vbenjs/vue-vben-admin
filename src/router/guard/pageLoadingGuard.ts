import type { Router } from 'vue-router';
import { useAppStoreWidthOut } from '/@/store/modules/app';
import { useUserStoreWidthOut } from '/@/store/modules/user';
import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
import { unref } from 'vue';

export function createPageLoadingGuard(router: Router) {
  const userStore = useUserStoreWidthOut();
  const appStore = useAppStoreWidthOut();
  const { getOpenPageLoading } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (!userStore.getToken) {
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
        appStore.setPageLoading(false);
      }, 220);
    }
    return true;
  });
}
