import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE, LAYOUT } from '../constant';
import { PageEnum } from '/@/enums/pageEnum';

import modules from 'globby!/@/router/routes/modules/**/*.@(ts)';

const routeModuleList: AppRouteModule[] = [];

Object.keys(modules).forEach((key) => {
  const mod = Array.isArray(modules[key]) ? [...modules[key]] : [modules[key]];
  routeModuleList.push(...mod);
});

export const asyncRoutes = [PAGE_NOT_FOUND_ROUTE, ...routeModuleList];

const MainRoute: AppRouteModule = {
  path: '/',
  name: 'MainRoute',
  component: LAYOUT,
  redirect: PageEnum.BASE_HOME,
  meta: {
    icon: 'bx:bx-home',
    title: 'routes.dashboard.dashboard',
  },
};

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: 'routes.basic.login',
  },
};

// 基础路由 不用权限
export const basicRoutes = [LoginRoute, MainRoute, REDIRECT_ROUTE];
