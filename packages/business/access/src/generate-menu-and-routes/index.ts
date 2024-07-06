import type { AccessModeType } from '@vben-core/preferences';
import type { RouteRecordRaw } from 'vue-router';

import type { GeneratorMenuAndRoutesOptions } from '../types';

import { cloneDepp } from '@vben-core/toolkit';

import { generateMenus } from './generate-menus';
import { generateRoutesByBackend } from './generate-routes-backend';
import { generateRoutesByFrontend } from './generate-routes-frontend';

async function generateMenusAndRoutes(
  mode: AccessModeType,
  options: GeneratorMenuAndRoutesOptions,
) {
  const { router } = options;

  options.routes = cloneDepp(options.routes);
  // 生成路由
  const accessibleRoutes = await generateRoutes(mode, options);

  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    router.addRoute(route);
  });

  // 生成菜单
  const accessibleMenus = await generateMenus1(mode, accessibleRoutes, options);

  return { accessibleMenus, accessibleRoutes };
}

/**
 * Generate routes
 * @param mode
 */
async function generateRoutes(
  mode: AccessModeType,
  options: GeneratorMenuAndRoutesOptions,
) {
  const { forbiddenComponent, roles, routes } = options;

  switch (mode) {
    // 允许所有路由访问，不做任何过滤处理
    case 'allow-all': {
      return routes;
    }
    case 'frontend': {
      return await generateRoutesByFrontend(
        routes,
        roles || [],
        forbiddenComponent,
      );
    }
    case 'backend': {
      return await generateRoutesByBackend(options);
    }
    default: {
      return routes;
    }
  }
}

async function generateMenus1(
  mode: AccessModeType,
  routes: RouteRecordRaw[],
  options: GeneratorMenuAndRoutesOptions,
) {
  const { router } = options;
  switch (mode) {
    case 'allow-all':
    case 'frontend':
    case 'backend': {
      return await generateMenus(routes, router);
    }
    default: {
      return [];
    }
  }
}

export { generateMenusAndRoutes };
