import store from '@/store/index';
import { hotModuleUnregisterModule } from '@/store/util';

import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';

import { filterAsyncRoutes } from '@/utils/auth/getRoutes';
import { transformObjToRoute } from '@/router/helper/routeHelper';

import { RoleEnum } from '@/enums/roleEnum';
import { AuthModeEnum } from '@/enums/appEnum';
import { ROLES_KEY } from '@/enums/cacheEnum';

import { getAsyncRoutes, createAsyncRoutes } from '@/router/index';

import { RouteConfigEx } from '@/router/types';

import { appStore } from '@/store/modules/app';
import { userStore } from '@/store/modules/user';

import { getUserInfoById } from '@/api/sys/menu';
import { RouteItem } from '@/api/sys/model/menuModel';

import { setSession, getSession, removeSession } from '@/store/persistent';
import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';
import { cloneDeep } from '@/utils/lodashChunk';

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

const NAME = 'permission';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
  // 角色列表
  roleState: RoleEnum[] = getSession(ROLES_KEY) || [];

  // 用户路由
  routesState: RouteConfigEx[] = [];

  flatRoutesState: RouteConfigEx[] = [];

  // 是否已经请求过路由权限
  hasRouteState = false;

  // 权限编码列表
  permCodeListState: string[] = [];

  get getRoleState(): RoleEnum[] {
    return this.roleState;
  }

  get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getHasRouteState(): boolean {
    return this.hasRouteState;
  }

  get getRoutesState(): RouteConfigEx[] {
    return this.routesState;
  }

  get getFlatRoutes(): RouteConfigEx[] {
    return this.flatRoutesState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitRoleState(role: RoleEnum[]): void {
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

  @Mutation
  commitFlatRoutesState(routes: RouteConfigEx[]): void {
    this.flatRoutesState = routes;
  }

  @Action
  async buildRoutesAction(id?: number | string): Promise<RouteConfigEx[]> {
    let routes: RouteConfigEx[] = [];
    const { authMode } = appStore.getProjCfg;
    if (authMode === AuthModeEnum.ROLE) {
      routes = filterAsyncRoutes(getAsyncRoutes());

      this.commitRoutesState(routes);
      this.commitFlatRoutesState(getFlatRoutes(routes));
    } else if (authMode === AuthModeEnum.BACK) {
      const userId = id || userStore.getUserInfoState.userId;
      if (!userId) {
        throw new Error('userId is undefined!');
      }
      const routeList: RouteItem[] = await getUserInfoById({
        userId,
      });
      const res = transformObjToRoute(routeList);
      res.push({
        path: '',
        component: PAGE_LAYOUT_COMPONENT,
        meta: {
          title: 'Redirect',
          icon: 'home|svg',
        },
        children: [
          {
            path: '/redirect/:path*',
            name: 'Redirect',
            component: () => createAsyncComponent(import('@/views/sys/redirect/index.vue')),
            meta: {
              title: '重定向',
            },
          },
        ],
      });

      routes = createAsyncRoutes(res);
      const cloneRoutes = cloneDeep(routes);
      this.commitRoutesState(cloneRoutes);
      this.commitFlatRoutesState(getFlatRoutes(cloneRoutes));
    }
    return routes;
  }
}
export { Permission };
export const permissionStore = getModule<Permission>(Permission);
