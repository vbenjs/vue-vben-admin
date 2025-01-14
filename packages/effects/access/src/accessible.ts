import type {
  AccessModeType,
  GenerateMenuAndRoutesOptions,
  RouteRecordRaw,
} from '@vben/types';

import {
  cloneDeep,
  generateMenus,
  generateRoutesByBackend,
  generateRoutesByFrontend,
  mapTree,
} from '@vben/utils';

async function generateAccessible(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const { router } = options;

  options.routes = cloneDeep(options.routes);
  // 生成路由
  const accessibleRoutes = await generateRoutes(mode, options);

  const root = router.getRoutes().find((item) => item.path === '/');

  // 动态添加到router实例内
  accessibleRoutes.forEach((route) => {
    if (root && !route.meta?.noBasicLayout) {
      // 为了兼容之前的版本用法，如果包含子路由，则将component移除，以免出现多层BasicLayout
      // 如果你的项目已经跟进了本次修改，移除了所有自定义菜单首级的BasicLayout，可以将这段if代码删除
      if (route.children && route.children.length > 0) {
        delete route.component;
      }
      root.children?.push(route);
    } else {
      router.addRoute(route);
    }
  });

  if (root) {
    if (root.name) {
      router.removeRoute(root.name);
    }
    router.addRoute(root);
  }

  // 生成菜单
  const accessibleMenus = await generateMenus(accessibleRoutes, options.router);

  return { accessibleMenus, accessibleRoutes };
}

/**
 * Generate routes
 * @param mode
 * @param options
 */
async function generateRoutes(
  mode: AccessModeType,
  options: GenerateMenuAndRoutesOptions,
) {
  const { forbiddenComponent, roles, routes } = options;

  let resultRoutes: RouteRecordRaw[] = routes;
  switch (mode) {
    case 'backend': {
      resultRoutes = await generateRoutesByBackend(options);
      break;
    }
    case 'frontend': {
      resultRoutes = await generateRoutesByFrontend(
        routes,
        roles || [],
        forbiddenComponent,
      );
      break;
    }
  }

  /**
   * 调整路由树，做以下处理：
   * 1. 对未添加redirect的路由添加redirect
   */
  resultRoutes = mapTree(resultRoutes, (route) => {
    // 如果有redirect或者没有子路由，则直接返回
    if (route.redirect || !route.children || route.children.length === 0) {
      return route;
    }
    const firstChild = route.children[0];

    // 如果子路由不是以/开头，则直接返回,这种情况需要计算全部父级的path才能得出正确的path，这里不做处理
    if (!firstChild?.path || !firstChild.path.startsWith('/')) {
      return route;
    }

    route.redirect = firstChild.path;
    return route;
  });

  return resultRoutes;
}

export { generateAccessible };
