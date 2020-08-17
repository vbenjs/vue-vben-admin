// import { NavigationGuard } from 'vue-router/types/router';

import NProgress from 'nprogress';
import 'nprogress/nprogress.css';

NProgress.inc(0.4);
NProgress.configure({ easing: 'ease', speed: 1000, showSpinner: false });

/**
 * @description: start progress
 */
export const startProgressGuard = () => {
  NProgress.start();
  // next();
};

export function closeProgressGuard() {
  NProgress.done();
}
