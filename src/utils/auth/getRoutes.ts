import { RouteConfigEx } from '@/router/types';
import { RoleEnum } from '@/enums/roleEnum';
import { getRole } from '.';
/**
 * 递归过滤异步路由表，返回符合用户角色权限的路由表
 * @param routes asyncRoutes
 * @param roles
 */
export function filterAsyncRoutes(routes: RouteConfigEx[]): RouteConfigEx[] {
  const roles = getRole();
  const res: RouteConfigEx[] = [];
  routes.forEach((route) => {
    const temp: RouteConfigEx = { ...route };
    if (hasAuth(roles, temp)) {
      if (temp.children) {
        temp.children = filterAsyncRoutes(temp.children);
      }
      res.push(temp);
    }
  });

  return res;
}
/**
 * 通过meta.role判断是否与当前用户权限匹配
 */
function hasAuth(roles: RoleEnum[], route: RouteConfigEx) {
  return route.meta && route.meta.roles
    ? roles.some((role) => {
        if (!route.meta || !route.meta.roles) {
          return true;
        }
        return route.meta.roles.includes(role);
      })
    : true;
}
