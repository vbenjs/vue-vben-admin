import type { RouteRecordRaw } from 'vue-router';

import { DEFAULT_HOME_PATH } from '@vben/constants';
import { $t } from '@vben/locales';

import { AuthPageLayoutType } from '@/layouts';

import Login from '@/views/_essential/authentication/login.vue';

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('@/views/_essential/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'Fallback',
  path: '/:path(.*)*',
};

/** 基本路由，这些路由是必须存在的 */
const essentialsRoutes: RouteRecordRaw[] = [
  {
    meta: {
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: DEFAULT_HOME_PATH,
  },
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
          title: $t('page.essentials.login'),
        },
      },
      {
        name: 'CodeLogin',
        path: 'code-login',
        component: () =>
          import('@/views/_essential/authentication/code-login.vue'),
        meta: {
          title: $t('page.essentials.code-login'),
        },
      },
      {
        name: 'QrCodeLogin',
        path: 'qrcode-login',
        component: () =>
          import('@/views/_essential/authentication/qrcode-login.vue'),
        meta: {
          title: $t('page.essentials.qrcode-login'),
        },
      },
      {
        name: 'ForgetPassword',
        path: 'forget-password',
        component: () =>
          import('@/views/_essential/authentication/forget-password.vue'),
        meta: {
          title: $t('page.essentials.forget-password'),
        },
      },
      {
        name: 'Register',
        path: 'register',
        component: () =>
          import('@/views/_essential/authentication/register.vue'),
        meta: {
          title: $t('page.essentials.register'),
        },
      },
    ],
  },
];

export { essentialsRoutes, fallbackNotFoundRoute };
