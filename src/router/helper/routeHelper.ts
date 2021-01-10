import type { AppRouteModule, AppRouteRecordRaw } from '/@/router/types';
import type { RouteLocationNormalized, RouteRecordNormalized } from 'vue-router';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { cloneDeep } from 'lodash-es';
import { warn } from '/@/utils/log';

export type LayoutMapKey = 'LAYOUT';

const LayoutMap = new Map<LayoutMapKey, () => Promise<typeof import('*.vue')>>();

const dynamicViewsModules = import.meta.glob('../../views/**/*.{vue,tsx}');

// 动态引入
function asyncImportRoute(routes: AppRouteRecordRaw[] | undefined) {
  if (!routes) return;
  routes.forEach((item) => {
    const { component, name } = item;
    const { children } = item;
    if (component) {
      item.component = dynamicImport(dynamicViewsModules, component as string);
    } else if (name) {
      item.component = getParentLayout(name);
    }
    children && asyncImportRoute(children);
  });
}

function dynamicImport(
  dynamicViewsModules: Record<
    string,
    () => Promise<{
      [key: string]: any;
    }>
  >,
  component: string
) {
  const keys = Object.keys(dynamicViewsModules);
  const matchKeys = keys.filter((key) => {
    const k = key.replace('../../views', '');
    return k.startsWith(`${component}`) || k.startsWith(`/${component}`);
  });
  if (matchKeys?.length === 1) {
    const matchKey = matchKeys[0];
    return dynamicViewsModules[matchKey];
  }
  if (matchKeys?.length > 1) {
    warn(
      'Please do not create `.vue` and `.TSX` files with the same file name in the same hierarchical directory under the views folder. This will cause dynamic introduction failure'
    );
    return;
  }
}

// Turn background objects into routing objects
export function transformObjToRoute<T = AppRouteModule>(routeList: AppRouteModule[]): T[] {
  LayoutMap.set('LAYOUT', LAYOUT);

  routeList.forEach((route) => {
    if (route.component) {
      if ((route.component as string).toUpperCase() === 'LAYOUT') {
        route.component = LayoutMap.get(route.component as LayoutMapKey);
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
