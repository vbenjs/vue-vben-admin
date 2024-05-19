import type { RouteRecordRaw } from 'vue-router';

import { Fallback } from '@vben/common-ui';

import { AuthPageLayout } from './layout';

/** 静态路由列表，访问这些页面可以不需要权限 */
const builtinRoutes: RouteRecordRaw[] = [
  {
    component: AuthPageLayout,
    meta: {
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    children: [
      {
        name: 'Login',
        path: 'login',
        component: () => import('@/views/authentication/login.vue'),
        meta: {
          ignoreAccess: true,
          title: 'Login',
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () => import('@/views/authentication/code-login.vue'),
        meta: {
          ignoreAccess: true,
          title: 'CodeLogin',
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () => import('@/views/authentication/qrcode-login.vue'),
        meta: {
          ignoreAccess: true,
          title: 'QrCodeLogin',
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () => import('@/views/authentication/forget-password.vue'),
        meta: {
          ignoreAccess: true,
          title: 'ForgetPassword',
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () => import('@/views/authentication/register.vue'),
        meta: {
          ignoreAccess: true,
          title: 'Register',
        },
      },
    ],
  },
  // 错误页
  {
    component: Fallback,
    meta: {
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
      title: 'Fallback',
    },
    name: 'Fallback',
    path: '/:path(.*)*',
  },
];

export { builtinRoutes };
