import store from '@/store/index';

import { VuexModule, Mutation, Module, getModule } from 'vuex-module-decorators';

import { filterAsyncRoutes } from '@/utils/auth/getRoutes';

import { getAsyncRoutes } from '@/router/index';

import { ROLES_KEY } from '@/enums/cacheEnum';
import { RouteConfigEx } from '@/router/type';

import { setSession, getSession, removeSession } from '@/store/persistent';

function getFlatRoutes(routes: RouteConfigEx[]): RouteConfigEx[] {
  const res: RouteConfigEx[] = [];
  routes.forEach((route) => {
    res.push(route);
    const { children } = route;
    if (children && children.length) {
      res.push(...getFlatRoutes(children));
    }
  });
  return res;
}

@Module({ dynamic: true, namespaced: true, store, name: 'permission' })
class Permission extends VuexModule {
  // 角色列表
  roleState: string[] = getSession(ROLES_KEY) || [];

  // 用户路由
  routesState: RouteConfigEx[] = [];

  // 是否已经请求过路由权限
  hasRouteState = false;

  get getRoleState(): string[] {
    return this.roleState;
  }

  get getHasRouteState(): boolean {
    return this.hasRouteState;
  }

  get getRoutesState(): RouteConfigEx[] {
    return filterAsyncRoutes(getAsyncRoutes());
  }

  get getFlatRoutes(): RouteConfigEx[] {
    const routes = filterAsyncRoutes(getAsyncRoutes());
    return getFlatRoutes(routes);
  }

  @Mutation
  commitRoleState(role: string[]): void {
    this.roleState = role;
    setSession(ROLES_KEY, role);
  }

  @Mutation
  commitHasRouteState(hasRoute: boolean): void {
    this.hasRouteState = hasRoute;
  }

  @Mutation
  commitReset(): void {
    this.roleState = [];
    this.routesState = [];
    removeSession(ROLES_KEY);
  }

  @Mutation
  commitRoutesState(routes: RouteConfigEx[]): void {
    this.routesState = routes;
  }
}
export { Permission };
export const permissionStore = getModule<Permission>(Permission);
