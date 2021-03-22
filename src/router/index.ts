import type { RouteRecordRaw } from 'vue-router';
import type { App } from 'vue';

// history 模式引入 createWebHistory 第一个参数即为路由的basePath
import { createRouter, createWebHashHistory } from 'vue-router';
import { basicRoutes, LoginRoute } from './routes';
import { REDIRECT_NAME } from './constant';
import { useGlobSetting } from '/@/hooks/setting';

const { publicPath = '/' } = useGlobSetting();

const WHITE_NAME_LIST = [LoginRoute.name, REDIRECT_NAME];

// app router
const router = createRouter({
  history: createWebHashHistory(publicPath),
  routes: (basicRoutes as unknown) as RouteRecordRaw[],
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

// reset router
export function resetRouter() {
  router.getRoutes().forEach((route) => {
    const { name } = route;
    if (name && !WHITE_NAME_LIST.includes(name as string)) {
      router.hasRoute(name) && router.removeRoute(name);
    }
  });
}

// config router
export function setupRouter(app: App<Element>) {
  app.use(router);
}

export default router;
