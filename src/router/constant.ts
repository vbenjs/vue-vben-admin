import type { AppRouteRecordRaw } from '/@/router/types';

const EXCEPTION_COMPONENT = () => import('../views/sys/exception/Exception');

/**
 * @description: default layout
 */
export const DEFAULT_LAYOUT_COMPONENT = () => import('/@/layouts/default/index');

/**
 * @description: page-layout
 */
export const PAGE_LAYOUT_COMPONENT = () => import('/@/layouts/page/index');

// 404 on a page
export const PAGE_NOT_FOUND_ROUTE: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: EXCEPTION_COMPONENT,
  meta: {
    title: 'ErrorPage',
    hideBreadcrumb: true,
  },
};

export const REDIRECT_ROUTE: AppRouteRecordRaw = {
  path: '/redirect/:path(.*)*',
  name: 'Redirect',
  component: () => import('/@/views/sys/redirect/index.vue'),
  meta: {
    title: 'Redirect',
    hideBreadcrumb: true,
  },
};
