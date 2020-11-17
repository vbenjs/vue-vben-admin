import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import { scrollWaiter } from './scrollWaiter';

import { createGuard } from './guard/';

import { basicRoutes } from './routes/';

// app router
const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as RouteRecordRaw[],
  strict: true,
  scrollBehavior: async (to, from, savedPosition) => {
    await scrollWaiter.wait();
    if (savedPosition) {
      return savedPosition;
    } else {
      if (to.matched.every((record, i) => from.matched[i] !== record)) {
        return { left: 0, top: 0 };
      }
      return false;
    }
  },
});

// reset router
export function resetRouter() {
  const resetWhiteNameList = [
    'Login',
    'Root',
    // 'FullErrorPage'
  ];
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !resetWhiteNameList.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// config router
export function setupRouter(app: App<Element>) {
  app.use(router);
  createGuard(router);
}

export default router;
