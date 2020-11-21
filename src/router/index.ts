import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import { createGuard } from './guard/';

import { basicRoutes } from './routes/';
import { scrollBehavior } from './scrollBehaviour';

// app router
const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as RouteRecordRaw[],
  strict: true,
  scrollBehavior: scrollBehavior,
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
