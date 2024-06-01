import type { RouteRecordRaw } from 'vue-router';

import { essentialRoutes } from './_essential';
import { nestedRoutes } from './modules/nested';
import { outsideRoutes } from './modules/outside';
import { rootRoutes } from './modules/root';
import { vbenRoutes } from './modules/vben';

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = [
  // 根路由
  ...rootRoutes,
  ...nestedRoutes,
  ...outsideRoutes,
  ...vbenRoutes,
];

/** 排除在主框架外的路由，这些路由没有菜单和顶部及其他框架内容 */
const externalRoutes: RouteRecordRaw[] = [];

/** 静态路由列表，访问这些页面可以不需要权限 */
const staticRoutes: RouteRecordRaw[] = [...essentialRoutes];

export { dynamicRoutes, externalRoutes, staticRoutes };
