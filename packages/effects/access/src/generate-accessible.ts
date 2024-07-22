import type { AccessModeType, GenerateMenuAndRoutesOptions } from '@vben/types';

import {
  cloneDepp,
  generateMenus,
  generateRoutesByBackend,
  generateRoutesByFrontend,
} from '@vben/utils';

async function generateAccessible(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
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
  const accessibleMenus = await generateMenus(accessibleRoutes, options.router);

  return { accessibleMenus, accessibleRoutes };
}

/**
 * Generate routes
 * @param mode
 */
async function generateRoutes(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
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

export { generateAccessible };
