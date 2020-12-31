import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

import { createRouter, createWebHashHistory } from 'vue-router';

import { createGuard } from './guard/';

import { basicRoutes } from './routes/';
import { scrollBehavior } from './scrollBehavior';
import { REDIRECT_NAME } from './constant';

// app router
const router = createRouter({
  history: createWebHashHistory(),
  routes: basicRoutes as RouteRecordRaw[],
  strict: true,
  scrollBehavior: scrollBehavior,
});

// reset router
export function resetRouter() {
  const resetWhiteNameList = ['Login', REDIRECT_NAME];
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

// router.onError((error) => {
//   console.error(error);
// });

export default router;
