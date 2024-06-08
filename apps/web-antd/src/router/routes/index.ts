import type { RouteRecordRaw } from 'vue-router';

import { mergeRouteModules } from '@vben-core/helpers';

import { essentialsRoutes } from './_essentials';

const dynamicRouteFiles = import.meta.glob('./dynamic/**/*.ts', {
  eager: true,
});

const staticRouteFiles = import.meta.glob('./static/**/*.ts', { eager: true });

const externalRouteFiles = import.meta.glob('./external/**/*.ts', {
  eager: true,
});

/** 动态路由 */
const dynamicRoutes: RouteRecordRaw[] = mergeRouteModules(dynamicRouteFiles);

/** 静态路由列表，访问这些页面可以不需要权限 */
const staticRoutes: RouteRecordRaw[] = mergeRouteModules(staticRouteFiles);

/** 排除在主框架外的路由，这些路由没有菜单和顶部及其他框架内容 */
const externalRoutes: RouteRecordRaw[] = mergeRouteModules(externalRouteFiles);

/** 路由列表，由基本路由+静态路由组成 */
const routes: RouteRecordRaw[] = [...essentialsRoutes, ...staticRoutes];

export { dynamicRoutes, externalRoutes, routes };
