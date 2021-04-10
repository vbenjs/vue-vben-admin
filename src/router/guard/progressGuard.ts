import type { Router } from 'vue-router';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import nProgress from 'nprogress';

import { unref } from 'vue';

export function createProgressGuard(router: Router) {
  const { getOpenNProgress } = useTransitionSetting();
  router.beforeEach(async (to) => {
    if (to.meta.loaded) return true;
    unref(getOpenNProgress) && nProgress.start();
    return true;
  });

  router.afterEach(async () => {
    // if (to.meta.loaded) return true;
    unref(getOpenNProgress) && nProgress.done();
    return true;
  });
}
