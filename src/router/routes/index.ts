import { RouteConfig } from 'vue-router/types/router';
import { ModuleRouteConfig } from '@/router/types';
import { parseRouteModule, sort } from '@/router/helper/routeHelper';

import { mainInRoutes, basicRoutes } from './basic';
import { getModulesRoute } from './getModules';
/**
 * @description: 创建框架外路由()
 */
export function createMainOutRoutes(routerModules: ModuleRouteConfig[]): RouteConfig[] {
  const routers = parseRouteModule(routerModules);
  return routers;
}

/**
 * @description: 创建主程路由(框架内)
 */

export function createMainInRoutes(routerModules: ModuleRouteConfig[]): RouteConfig[] {
  const routeModules: ModuleRouteConfig[] = sort(routerModules);
  const routes = parseRouteModule(routeModules);
  mainInRoutes.children = routes;
  return [mainInRoutes, ...basicRoutes];
}

export function createAsyncRoutes(routes: RouteConfig[]): RouteConfig[] {
  mainInRoutes.children = routes;
  return [mainInRoutes, ...basicRoutes];
}

/**
 * @description: 异步路由
 */
export const getAsyncRoutes = () => createMainInRoutes(getModulesRoute());
