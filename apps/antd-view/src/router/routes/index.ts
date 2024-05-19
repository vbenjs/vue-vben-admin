import type { RouteRecordRaw } from 'vue-router';

import { builtinRoutes } from './builtin';
import { Layout } from './layout';
import { nestedRoutes } from './modules/nested';
import { outsideRoutes } from './modules/outside';

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = [
  // 根路由
  {
    component: Layout,
    meta: {
      hideChildrenInMenu: true,
      title: '首页',
    },
    name: 'Home',
    path: '/',
    redirect: '/welcome',
    children: [
      {
        name: 'Welcome',
        path: '/welcome',
        component: () => import('@/views/dashboard/index.vue'),
        meta: {
          affixTab: true,
          title: 'Welcome',
        },
      },
    ],
  },
  ...nestedRoutes,
  ...outsideRoutes,
  // 关于
  {
    component: Layout,
    meta: {
      hideChildrenInMenu: true,
      icon: 'https://cdn.jsdelivr.net/gh/vbenjs/vben-cdn-static@0.1.2/vben-admin/admin-logo.png',
      keepAlive: false,
      title: '关于',
    },
    name: 'AboutLayout',
    path: '/about',
    redirect: '/about/index',
    children: [
      {
        name: 'About',
        path: 'index',
        component: () => import('@/views/about/index.vue'),
        meta: {
          keepAlive: false,
          title: '关于',
        },
      },
    ],
  },
];

/** 排除在主框架外的路由，这些路由没有菜单和顶部及其他框架内容 */
const externalRoutes: RouteRecordRaw[] = [];

/** 静态路由列表，访问这些页面可以不需要权限 */
const staticRoutes: RouteRecordRaw[] = [...builtinRoutes];

export { dynamicRoutes, externalRoutes, staticRoutes };
