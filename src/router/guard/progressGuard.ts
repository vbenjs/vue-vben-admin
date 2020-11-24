import type { Router } from 'vue-router';

import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { unref } from 'vue';

const { getOpenNProgress } = useTransitionSetting();

export function createProgressGuard(router: Router) {
  // NProgress.inc(0.1);
  // NProgress.configure({ easing: 'ease', speed: 200, showSpinner: false });

  router.beforeEach(async (to) => {
    !to.meta.inTab && unref(getOpenNProgress) && NProgress.start();
    return true;
  });

  router.afterEach(async (to) => {
    !to.meta.inTab && unref(getOpenNProgress) && NProgress.done();
    return true;
  });
}
