import type { Router } from 'vue-router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.inc(0.4);
NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false });

export function createProgressGuard(router: Router) {
  router.beforeEach(async () => {
    NProgress.start();
    return true;
  });
  router.afterEach(async () => {
    NProgress.done();
    return true;
  });
}
