import type { RouteRecordName, RouteRecordRaw } from 'vue-router';

import { createRouter, createWebHashHistory } from 'vue-router';

import { traverseTreeValues } from '@vben/utils';

import { createRouterGuard } from './guard';
import { routes } from './routes';

/**
 *  @zh_CN 创建vue-router实例
 */
const router = createRouter({
  history: createWebHashHistory(import.meta.env.VITE_PUBLIC_PATH),
  // 应该添加到路由的初始路由列表。
  routes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
  // 是否应该禁止尾部斜杠。默认为假
  // strict: true,
});

/**
 * @zh_CN 重置所有路由，如有指定白名单除外
 */
function resetRoutes() {
  // 获取静态路由所有节点包含子节点的 name，并排除不存在 name 字段的路由
  const staticRouteNames = traverseTreeValues<
    RouteRecordRaw,
    RouteRecordName | undefined
  >(routes, (route) => {
    // 这些路由需要指定 name，防止在路由重置时，不能删除没有指定 name 的路由
    if (import.meta.env.DEV && !route.name) {
      console.warn(
        `The route with the path ${route.path} needs to have the field name specified.`,
      );
    }
    return route.name;
  });

  const { getRoutes, hasRoute, removeRoute } = router;
  const allRoutes = getRoutes();
  allRoutes.forEach(({ name }) => {
    // 存在于路由表且非白名单才需要删除
    if (name && !staticRouteNames.includes(name) && hasRoute(name)) {
      removeRoute(name);
    }
  });
}
// 创建路由守卫
createRouterGuard(router);

export { resetRoutes, router };
