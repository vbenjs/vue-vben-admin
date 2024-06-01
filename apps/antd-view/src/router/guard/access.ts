import type { ExRouteRecordRaw, MenuRecordRaw } from '@vben/types';

import type { RouteRecordRaw, Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { useAccessStore } from '@vben/stores';
import { filterTree, mapTree, traverseTreeValues } from '@vben/utils';

import { dynamicRoutes } from '@/router/routes';

// 不需要权限的页面白名单
const WHITE_ROUTE_NAMES = new Set<string>([]);

/**
 * 权限访问守卫配置
 * @param router
 */
function configAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const accessToken = accessStore.getAccessToken;

    // accessToken 检查
    if (!accessToken) {
      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 白名单路由列表检查
      // TODO: 不是很需要，通过 ignoreAccess 也可以做到，考虑删除
      if (WHITE_ROUTE_NAMES.has(to.name as string)) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query: { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    const accessRoutes = accessStore.getAccessRoutes;

    // 是否已经生成过动态路由
    if (accessRoutes && accessRoutes.length > 0) {
      return true;
    }

    // 生成路由表
    // 当前登录用户拥有的角色标识列表
    const userRoles = accessStore.getUserRoles;
    const routes = await generatorRoutes(userRoles);
    // 动态添加到router实例内
    routes.forEach((route) => router.addRoute(route));

    const menus = await generatorMenus(routes, router);

    // 保存菜单信息和路由信息
    accessStore.setAccessMenus(menus);
    accessStore.setAccessRoutes(routes);
    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);

    return {
      path: redirect,
      replace: true,
    };
  });
}

/**
 * 动态生成路由
 */
async function generatorRoutes(roles: string[]): Promise<RouteRecordRaw[]> {
  // 根据角色标识过滤路由表,判断当前用户是否拥有指定权限
  return filterTree(dynamicRoutes, (route) => {
    return hasVisible(route) && hasAuthority(route, roles);
  });
}

/**
 * 根据 routes 生成菜单列表
 * @param routes
 */
async function generatorMenus(
  routes: RouteRecordRaw[],
  router: Router,
): Promise<MenuRecordRaw[]> {
  // 获取所有router最终的path及name
  const finalRoutes = traverseTreeValues(
    router.getRoutes(),
    ({ name, path }) => {
      return {
        name,
        path,
      };
    },
  );

  const menus = mapTree<ExRouteRecordRaw, MenuRecordRaw>(routes, (route) => {
    // 路由表的路径写法有多种，这里从router获取到最终的path并赋值
    const matchRoute = finalRoutes.find(
      (finalRoute) => finalRoute.name === route.name,
    );

    // 转换为菜单结构
    const path = matchRoute?.path ?? route.path;
    const { meta, name: routeName, redirect, children } = route;
    const {
      badge,
      badgeType,
      badgeVariants,
      hideChildrenInMenu = false,
      icon,
      orderNo,
      target,
      title = '',
    } = meta || {};

    const name = (title || routeName || '') as string;

    // 隐藏子菜单
    const resultChildren = hideChildrenInMenu
      ? []
      : (children as MenuRecordRaw[]);

    // 将菜单的所有父级和父级菜单记录到菜单项内
    if (resultChildren && resultChildren.length > 0) {
      resultChildren.forEach((child) => {
        child.parents = [...(route.parents || []), path];
        child.parent = path;
      });
    }
    // 隐藏子菜单
    const resultPath = hideChildrenInMenu ? redirect : target || path;
    return {
      badge,
      badgeType,
      badgeVariants,
      icon,
      name,
      orderNo,
      parent: route.parent,
      parents: route.parents,
      path: resultPath,
      children: resultChildren,
    };
  });

  return menus;
}

/**
 * 判断路由是否有权限访问
 * @param route
 * @param access
 */
function hasAuthority(route: RouteRecordRaw, access: string[]) {
  const authority = route.meta?.authority;
  if (!authority) {
    return true;
  }
  const authSet = new Set(authority);
  return access.some((value) => {
    return authSet.has(value);
  });
}

/**
 * 判断路由是否需要在菜单中显示
 * @param route
 */
function hasVisible(route: RouteRecordRaw) {
  return !route.meta?.hideInMenu;
}

export { configAccessGuard };
