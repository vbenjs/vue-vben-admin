import { ModuleRouteConfig, RouteConfigEx } from '@/router/types';
import { RouteConfig } from 'vue-router/types/router';
// import { cloneDeep } from '@/utils/lodashChunk';
import { buildUUID } from '@/utils/uuid';
import { PAGE_LAYOUT_COMPONENT, BLANK_LAYOUT_COMPONENT } from '@/router/constant';
import { getLazyComponent } from '@/common/factory/getLazyComponent';
import { RouteItem } from '@/api/sys/model/menuModel';

/**
 * @description: 替换斜杠
 */
function replaceReq(path: string): string {
  return `/${path}`.replace(/\/{1,}/g, '/');
}

/**
 * @description:为路由添加前缀
 */
function addRoutePrefix(route: RouteConfigEx, prefix: string, resChildren: RouteConfigEx[]): void {
  const { path, children } = route;

  const reqPath = prefix ? replaceReq(prefix) : '';

  const isAddPrefix = (route as any).isAddPrefix;

  let fullPath = '';
  const match = (/^\/(.*)\//.exec(replaceReq(path)) || [])[0];
  if (path !== match && !isAddPrefix) {
    fullPath = reqPath + replaceReq(path);
  } else {
    fullPath = replaceReq(path);
  }

  route.path = fullPath;
  Reflect.defineProperty(route, 'isAddPrefix', {
    configurable: false,
    enumerable: false,
    value: true,
    writable: false,
  });
  !children && resChildren.push(route);
  if (children) {
    children.forEach((child) => {
      addRoutePrefix(child, prefix + replaceReq(path), resChildren);
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

  const children: RouteConfigEx[] = [];
  for (const route of routes) {
    addRoutePrefix(route, prefix, children);
  }
  const _layout = layout as RouteConfigEx;
  if (layout) {
    const uuid = buildUUID();
    _layout.name = _layout.name || uuid;
    _layout.path = _layout.path || replaceReq(uuid);
    layout.children = children;
  }

  return _layout || children;
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

export function transformObjToRoute(routeList: RouteItem[]) {
  return routeList.filter((route) => {
    const { component, children } = route;
    if (component) {
      route.component =
        component === 'PAGE_LAYOUT' ? PAGE_LAYOUT_COMPONENT : getLazyComponent(component);
    } else {
      route.component = BLANK_LAYOUT_COMPONENT;
    }
    if (children) {
      route.children = transformObjToRoute(children);
    }
    return true;
  });
}
