import { filterTree } from '@vben-core/toolkit';
import type { RouteRecordRaw } from 'vue-router';
/**
 * 动态生成路由
 */
async function generatorRoutes(
  routes: RouteRecordRaw[],
  roles: string[],
): Promise<RouteRecordRaw[]> {
  // 根据角色标识过滤路由表,判断当前用户是否拥有指定权限
  return filterTree(routes, (route) => {
    return hasVisible(route) && hasAuthority(route, roles);
  });
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
  return access.some((value) => {
    return authority.includes(value);
  });
}

/**
 * 判断路由是否需要在菜单中显示
 * @param route
 */
function hasVisible(route?: RouteRecordRaw) {
  return !route?.meta?.hideInMenu;
}

export { generatorRoutes, hasAuthority, hasVisible };
