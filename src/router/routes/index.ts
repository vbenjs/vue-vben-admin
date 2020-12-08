import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '../constant';

import modules from 'globby!/@/router/routes/modules/**/*.@(ts)';

import { t } from '/@/hooks/web/useI18n';

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = Array.isArray(modules[key]) ? [...modules[key]] : [modules[key]];
  routeModuleList.push(...mod);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: t('routes.basic.login'),
  },
};

// 基础路由 不用权限
export const basicRoutes = [LoginRoute, REDIRECT_ROUTE];
