import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import dynamicImport from './dynamicImport';
import { cloneDeep } from 'lodash-es';

export type LayoutMapKey = 'LAYOUT';

const LayoutMap = new Map<LayoutMapKey, () => Promise<typeof import('*.vue')>>();

// 动态引入
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  if (!routes) return;
  routes.forEach((item) => {
    const { component, name } = item;
    const { children } = item;
    if (component) {
      item.component = dynamicImport(component);
    } else if (name) {
      item.component = getParentLayout(name);
    }
    children && asyncImportRoute(children);
  });
}

// Turn background objects into routing objects
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  LayoutMap.set('LAYOUT', LAYOUT);

  routeList.forEach((route) => {
    if (route.component) {
      if ((route.component as string).toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(route.component);
      } else {
        route.children = [cloneDeep(route)];
        route.component = LAYOUT;
        route.name = `${route.name}Parent`;
        route.path = '';
        const meta = route.meta || {};
        meta.single = true;
        meta.affix = false;
        route.meta = meta;
      }
    }
    route.children && asyncImportRoute(route.children);
  });
  return (routeList as unknown) as T[];
}

// Return to the new routing structure, not affected by the original example
export function getRoute(route: RouteLocationNormalized): RouteLocationNormalized {
  if (!route) return route;
  const { matched, ...opt } = route;
  return {
    ...opt,
    matched: (matched
      ? matched.map((item) => ({
          meta: item.meta,
          name: item.name,
          path: item.path,
        }))
      : undefined) as RouteRecordNormalized[],
  };
}
