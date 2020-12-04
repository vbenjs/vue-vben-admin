import type { Router } from 'vue-router';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { unref } from 'vue';

const { getOpenNProgress } = useTransitionSetting();

export function createProgressGuard(router: Router) {
  router.beforeEach(async (to) => {
    if (to.meta.loaded) return true;
    unref(getOpenNProgress) && NProgress.start();
    return true;
  });

  router.afterEach(async (to) => {
    if (to.meta.loaded) return true;
    unref(getOpenNProgress) && NProgress.done();
    return true;
  });
}
