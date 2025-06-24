import type { RouteRecordRaw } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';

import { AuthPageLayout, BasicLayout } from '#/layouts';
import { $t } from '#/locales';
import { DefaultRoutes } from '#/shared/constants';
import Login from '#/views/_core/authentication/login.vue';

/** 全局404页面 */
const fallbackNotFoundRoute: RouteRecordRaw = {
  component: () => import('#/views/_core/fallback/not-found.vue'),
  meta: {
    hideInBreadcrumb: true,
    hideInMenu: true,
    hideInTab: true,
    title: '404',
  },
  name: 'FallbackNotFound',
  path: '/:path(.*)*',
};

/** 基本路由，这些路由是必须存在的 */
const coreRoutes: RouteRecordRaw[] = [
  /**
   * 根路由
   * 使用基础布局，作为所有页面的父级容器，子级就不必配置BasicLayout。
   * 此路由必须存在，且不应修改
   */
  {
    component: BasicLayout,
    meta: {
      hideInBreadcrumb: true,
      title: 'Root',
    },
    name: 'Root',
    path: '/',
    redirect: DefaultRoutes.ONBOARD,
    children: [],
  },
  {
    component: AuthPageLayout,
    meta: {
      hideInTab: true,
      title: 'Authentication',
    },
    name: 'Authentication',
    path: '/auth',
    redirect: LOGIN_PATH,
    children: [
      {
        name: 'Login',
        path: 'login',
        component: Login,
        meta: {
          title: $t('page.auth.login'),
        },
      },
    ],
    props: {
      toolbar: true,
      toolbarList: ['theme'],
    },
  },
  // This route will remove all pinia stores and then login to the shop.
  // This route should not be added to loginPaths, because it is not a login route for normal shop.
  {
    name: 'Auth With Shopify',
    path: '/auth/shopify',
    component: () => import('#/views/_core/authentication/auth-shopify.vue'),
    meta: {
      ignoreAccess: true,
      title: 'Auth With Shopify',
    },
  },
  // This route will be used by Admin Staff to login to the shop.
  {
    name: 'Auth With Token',
    path: '/auth/token',
    component: () => import('#/views/_core/authentication/auth-token.vue'),
    meta: {
      ignoreAccess: true,
      title: 'Auth With Token',
    },
  },
];

const loginPaths = [LOGIN_PATH];

export { coreRoutes, fallbackNotFoundRoute, loginPaths };
