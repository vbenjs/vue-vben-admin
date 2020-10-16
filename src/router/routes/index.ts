import type { AppRouteRecordRaw, AppRouteModule } from '/@/router/types';

import { DEFAULT_LAYOUT_COMPONENT, PAGE_NOT_FOUND_ROUTE, REDIRECT_ROUTE } from '../constant';
import { genRouteModule } from '/@/utils/helper/routeHelper';
import modules from 'globby!/@/router/routes/modules/**/*.@(ts)';

// import dashboard from './modules/dashboard';
// demo
// import exceptionDemo from './modules/demo/exception';
// import iframeDemo from './modules/demo/iframe';
// import compDemo from './modules/demo/comp';
// import permissionDemo from './modules/demo/permission';
// import featDemo from './modules/demo/feat';
// import chartsDemo from './modules/demo/charts';
// import tableDemo from './modules/demo/table';
// import formDemo from './modules/demo/form';
// import treeDemo from './modules/demo/tree';

const routeModuleList: AppRouteModule[] = [
  // exceptionDemo,
  // dashboard,
  // iframeDemo,
  // compDemo,
  // featDemo,
  // permissionDemo,
  // chartsDemo,
  // tableDemo,
  // formDemo,
  // treeDemo,
];

Object.keys(modules).forEach((key) => {
  routeModuleList.push(modules[key]);
});

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

export const LoginRoute: AppRouteRecordRaw = {
  path: '/login',
  name: 'Login',
  component: () => import('/@/views/sys/login/Login.vue'),
  meta: {
    title: '登录',
  },
};

// 基础路由 不用权限
export const basicRoutes = [LoginRoute, RootRoute];
