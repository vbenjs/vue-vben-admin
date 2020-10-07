import type { Router } from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

export function createProgressGuard(router: Router) {
  NProgress.inc(0.1);
  NProgress.configure({ easing: 'ease', speed: 200, showSpinner: false });

  router.beforeEach(async () => {
    NProgress.start();
    return true;
  });
  router.afterEach(async () => {
    NProgress.done();
    return true;
  });
}
