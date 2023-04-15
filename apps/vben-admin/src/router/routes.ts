import { loggerWarning, traverseTree } from '@vben/shared';
import type { RouteRecordName, RouteRecordRaw } from 'vue-router';

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = [];

/** 静态路由列表，访问这些页面可以不需要权限 */
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

/** 排查在主框架外的路由，这些路由没有菜单和顶部及其他框架内容 */
const externalRoutes: RouteRecordRaw[] = [];

/**
 * @description 获取静态路由所有节点包含子节点的 name，并排除不存在 name 字段的路由
 */
const staticRouteNames = traverseTree<RouteRecordRaw, RouteRecordName | undefined>(
  staticRoutes,
  (route) => route.children,
  (route) => {
    // 提示这些路由需要指定 name，防止在路由重置时，不能删除没有指定 name 的路由
    if (!route.name) {
      loggerWarning(`The route with the path ${route.path} needs to specify the field name`);
    }
    return route.name;
  },
);

export { dynamicRoutes, externalRoutes, staticRouteNames, staticRoutes };
