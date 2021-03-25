import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import store from '/@/store';
import { toRaw } from 'vue';
import { VuexModule, Mutation, Module, getModule, Action } from 'vuex-module-decorators';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { appStore } from '/@/store/modules/app';
import { userStore } from '/@/store/modules/user';
import projectSetting from '/@/settings/projectSetting';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import { filter } from '/@/utils/helper/treeHelper';

import { getMenuListById } from '/@/api/sys/menu';
import { getPermCodeByUserId } from '/@/api/sys/user';

import { useMessage } from '/@/hooks/web/useMessage';
import { useI18n } from '/@/hooks/web/useI18n';

const NAME = 'app-permission';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Permission extends VuexModule {
  // Permission code list
  private permCodeListState: string[] = [];

  // Whether the route has been dynamically added
  private isDynamicAddedRouteState = false;

  // To trigger a menu update
  private lastBuildMenuTimeState = 0;

  // Backstage menu list
  private backMenuListState: Menu[] = [];

  get getPermCodeListState() {
    return this.permCodeListState;
  }

  get getBackMenuListState() {
    return this.backMenuListState;
  }

  get getLastBuildMenuTimeState() {
    return this.lastBuildMenuTimeState;
  }

  get getIsDynamicAddedRouteState() {
    return this.isDynamicAddedRouteState;
  }

  @Mutation
  commitPermCodeListState(codeList: string[]): void {
    this.permCodeListState = codeList;
  }

  @Mutation
  commitBackMenuListState(list: Menu[]): void {
    this.backMenuListState = list;
  }

  @Mutation
  commitLastBuildMenuTimeState(): void {
    this.lastBuildMenuTimeState = new Date().getTime();
  }

  @Mutation
  commitDynamicAddedRouteState(added: boolean): void {
    this.isDynamicAddedRouteState = added;
  }

  @Mutation
  commitResetState(): void {
    this.isDynamicAddedRouteState = false;
    this.permCodeListState = [];
    this.backMenuListState = [];
    this.lastBuildMenuTimeState = 0;
  }

  @Action
  async changePermissionCode(userId: string) {
    const codeList = await getPermCodeByUserId({ userId });
    this.commitPermCodeListState(codeList);
  }

  @Action
  async buildRoutesAction(id?: number | string): Promise<AppRouteRecordRaw[]> {
    const { t } = useI18n();
    let routes: AppRouteRecordRaw[] = [];
    const roleList = toRaw(userStore.getRoleListState);
    const { permissionMode = projectSetting.permissionMode } = appStore.getProjectConfig;
    // role permissions
    if (permissionMode === PermissionModeEnum.ROLE) {
      const routeFilter = (route: AppRouteRecordRaw) => {
        const { meta } = route;
        const { roles } = meta || {};
        if (!roles) return true;
        return roleList.some((role) => roles.includes(role));
      };
      routes = filter(asyncRoutes, routeFilter);
      routes = routes.filter(routeFilter);
      // Convert multi-level routing to level 2 routing
      routes = flatMultiLevelRoutes(routes);
      //  If you are sure that you do not need to do background dynamic permissions, please comment the entire judgment below
    } else if (permissionMode === PermissionModeEnum.BACK) {
      const { createMessage } = useMessage();

      createMessage.loading({
        content: t('sys.app.menuLoading'),
        duration: 1,
      });
      // Here to get the background routing menu logic to modify by yourself
      const paramId = id || userStore.getUserInfoState.userId;

      // !Simulate to obtain permission codes from the background,
      // this function may only need to be executed once, and the actual project can be put at the right time by itself
      try {
        this.changePermissionCode('1');
      } catch (error) {}
      if (!paramId) {
        throw new Error('paramId is undefined!');
      }
      let routeList = (await getMenuListById({ id: paramId })) as AppRouteRecordRaw[];

      // Dynamically introduce components
      routeList = transformObjToRoute(routeList);

      //  Background routing to menu structure
      const backMenuList = transformRouteToMenu(routeList);
      this.commitBackMenuListState(backMenuList);

      routeList = flatMultiLevelRoutes(routeList);
      routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
    }
    routes.push(ERROR_LOG_ROUTE);
    return routes;
  }
}
export const permissionStore = getModule<Permission>(Permission);
