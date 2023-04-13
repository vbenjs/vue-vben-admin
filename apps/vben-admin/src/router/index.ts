import { createRouter, createWebHashHistory } from 'vue-router';

import { staticRouteNames, staticRoutes } from './routes';

/**
 *  @description 创建vue-router实例
 */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes: staticRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

/**
 * @description 重置所有路由，如有指定白名单除外
 */
function resetRoutes() {
  const routes = router.getRoutes();
  const { hasRoute, removeRoute } = router;
  routes.forEach(({ name }) => {
    // 存在于路由表且非白名单才需要删除
    if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
      removeRoute(name);
    }
  });
}

export { resetRoutes, router };
