import type { RouteRecordRaw } from 'vue-router';

import { $t } from '@vben/locales';

import { AuthPageLayoutType } from '@/layouts';

import Login from '@/views/_essential/authentication/login.vue';

/** 基本路由，这些路由是必须存在的 */
const essentialsRoutes: RouteRecordRaw[] = [
  {
    component: AuthPageLayoutType,
    meta: {
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
        meta: {
          ignoreAccess: true,
          title: $t('page.login'),
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () =>
          import('@/views/_essential/authentication/code-login.vue'),
        meta: {
          ignoreAccess: true,
          title: $t('page.code-login'),
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () =>
          import('@/views/_essential/authentication/qrcode-login.vue'),
        meta: {
          ignoreAccess: true,
          title: $t('page.qrcode-login'),
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () =>
          import('@/views/_essential/authentication/forget-password.vue'),
        meta: {
          ignoreAccess: true,
          title: $t('page.forget-password'),
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () =>
          import('@/views/_essential/authentication/register.vue'),
        meta: {
          ignoreAccess: true,
          title: $t('page.register'),
        },
      },
    ],
  },
  // 错误页
  {
    component: () => import('@/views/_essential/fallback/not-found.vue'),
    meta: {
      hideInBreadcrumb: true,
      hideInMenu: true,
      hideInTab: true,
      // ignoreAccess: true,
      title: 'Fallback',
    },
    name: 'Fallback',
    path: '/:path(.*)*',
  },
];

export { essentialsRoutes };
