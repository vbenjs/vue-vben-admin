import { traverseTree } from '@vben/shared';
import type { RouteRecordName, RouteRecordRaw } from 'vue-router';

// export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

/**
 * @description 静态路由列表，访问这些页面可以不需要权限
 */
const staticRoutes: RouteRecordRaw[] = [
  // 根路由
  {
    path: '/',
    name: 'Root',
    redirect: '/dashboard',
    meta: {
      title: 'Root',
    },
  },
  {
    path: '/:path(.*)*',
    name: 'PageNotFound',
    component: () => import('@/pages/error-page/index.vue'),
    meta: {
      title: 'PageNotFound',
    },
  },
  // {
  //   path: '/login',
  //   name: 'Login',
  //   component: () => import('@/views/sys/login/Login.vue'),
  //   meta: {
  //     title: 'Login',
  //   },
  // },
];

/**
 * @description 获取静态路由所有节点包含子节点的 name，并排除不存在 name 字段的路由
 */
const staticRouteNames = traverseTree<RouteRecordRaw, RouteRecordName | undefined>(
  staticRoutes,
  (route) => route.children,
  (route) => route.name,
).filter(Boolean);

export { staticRouteNames, staticRoutes };

// Basic routing without permission
// 未经许可的基本路由
// export const basicRoutes = [
//   LoginRoute,
//   RootRoute,
//   ...mainOutRoutes,
//   REDIRECT_ROUTE,
//   PAGE_NOT_FOUND_ROUTE,
// ];
