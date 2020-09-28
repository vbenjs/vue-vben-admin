import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { DEFAULT_LAYOUT_COMPONENT, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '../constant';
import { genRouteModule } from '/@/utils/helper/routeHelper';

import LoginRoute from './modules/sys';
// demo
import exceptionDemo from './modules/demo/exception';
import dashboardDemo from './modules/demo/dashboard';
import iframeDemo from './modules/demo/iframe';
import compDemo from './modules/demo/comp';
import permissionDemo from './modules/demo/permission';
import featDemo from './modules/demo/feat';

const routeModuleList: AppRouteModule[] = [
  exceptionDemo,
  dashboardDemo,
  iframeDemo,
  compDemo,
  featDemo,
  permissionDemo,
];

export const asyncRoutes = [
  REDIRECT_ROUTE,
  PAGE_NOT_FOUND_ROUTE,
  ...genRouteModule(routeModuleList),
];
// 主框架根路由
export const RootRoute: AppRouteRecordRaw = {
  path: '/',
  name: 'Root',
  component: DEFAULT_LAYOUT_COMPONENT,
  redirect: '/dashboard',
  meta: {
    title: 'Root',
  },
  children: [],
};

// 基础路由 不用权限
export const basicRoutes = [LoginRoute, RootRoute];
