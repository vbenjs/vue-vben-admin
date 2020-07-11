import { ModuleRouteConfig, RouteConfigEx } from '@/router/type';
import { RouteConfig } from 'vue-router/types/router';

import { buildUUID } from '@/utils/uuid';
/**
 * @description: 替换斜杠
 */
function replaceReq(path: string): string {
  return `/${path}`.replace(/\/{1,}/g, '/');
}

/**
 * @description:为路由添加前缀
 */
function addRoutePrefix(route: RouteConfigEx, prefix: string): void {
  const { path, children } = route;
  const reqPath = prefix ? replaceReq(prefix) : '';

  const fullPath = (!path.startsWith(reqPath) ? reqPath : '') + replaceReq(path);

  route.path = fullPath;
  if (children) {
    children.forEach((child) => {
      addRoutePrefix(child, prefix);
    });
  }
}

/**
 * @description: 生成路由模块
 */
export function buildRouteModule(
  routeModule: ModuleRouteConfig | ModuleRouteConfig
): RouteConfigEx | RouteConfigEx[] {
  const { routes, prefix, layout } = routeModule;

  for (const route of routes) {
    addRoutePrefix(route, prefix);
  }
  const _layout = layout as RouteConfigEx;
  if (layout) {
    const uuid = buildUUID();
    _layout.name = _layout.name || uuid;
    _layout.path = _layout.path || replaceReq(uuid);
    layout.children = routes;
  }
  return _layout || routes;
}
/** 对路由进行排序 */
export const sort = <T extends any[] = ModuleRouteConfig[]>(routes: T): T => {
  return routes.sort((a, b) => {
    const { orderNo = 0 } = a;
    const { orderNo: borderNo = 0 } = b;
    return orderNo - borderNo;
  });
};

/**
 * @description: 解析路由模块
 */
export function parseRouteModule(routeModules: ModuleRouteConfig[]): RouteConfig[] {
  const routes: RouteConfig[] = [];

  for (const routeModule of routeModules) {
    if (!routeModule) {
      continue;
    }
    const moduleRoutes = buildRouteModule(routeModule);
    // 如果没设置layout,返回的是数组
    if (Array.isArray(moduleRoutes)) {
      routes.push(...moduleRoutes);
    } else {
      routes.push(moduleRoutes);
    }
  }
  return routes;
}
