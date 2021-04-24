import type { AppRouteRecordRaw, Menu } from '/@/router/types';

import { defineStore } from 'pinia';
import { store } from '/@/store';
import { useI18n } from '/@/hooks/web/useI18n';
import { useUserStore } from './user';
import { useAppStoreWidthOut } from './app';
import { toRaw } from 'vue';
import { transformObjToRoute, flatMultiLevelRoutes } from '/@/router/helper/routeHelper';
import { transformRouteToMenu } from '/@/router/helper/menuHelper';

import projectSetting from '/@/settings/projectSetting';

import { PermissionModeEnum } from '/@/enums/appEnum';

import { asyncRoutes } from '/@/router/routes';
import { ERROR_LOG_ROUTE, PAGE_NOT_FOUND_ROUTE } from '/@/router/routes/basic';

import { filter } from '/@/utils/helper/treeHelper';

import { getMenuListById } from '/@/api/sys/menu';
import { getPermCodeByUserId } from '/@/api/sys/user';

import { useMessage } from '/@/hooks/web/useMessage';

interface PermissionState {
  // Permission code list
  permCodeList: string[];
  // Whether the route has been dynamically added
  isDynamicAddedRoute: boolean;
  // To trigger a menu update
  lastBuildMenuTime: number;
  // Backstage menu list
  backMenuList: Menu[];
}
export const usePermissionStore = defineStore({
  id: 'app-permission',
  state: (): PermissionState => ({
    permCodeList: [],
    // Whether the route has been dynamically added
    isDynamicAddedRoute: false,
    // To trigger a menu update
    lastBuildMenuTime: 0,
    // Backstage menu list
    backMenuList: [],
  }),
  getters: {
    getPermCodeList() {
      return this.permCodeList;
    },
    getBackMenuList() {
      return this.backMenuList;
    },
    getLastBuildMenuTime() {
      return this.lastBuildMenuTime;
    },
    getIsDynamicAddedRoute() {
      return this.isDynamicAddedRoute;
    },
  },
  actions: {
    setPermCodeList(codeList: string[]) {
      this.permCodeList = codeList;
    },

    setBackMenuList(list: Menu[]) {
      this.backMenuList = list;
    },

    setLastBuildMenuTime() {
      this.lastBuildMenuTime = new Date().getTime();
    },

    setDynamicAddedRoute(added: boolean) {
      this.isDynamicAddedRoute = added;
    },
    resetState(): void {
      this.isDynamicAddedRoute = false;
      this.permCodeList = [];
      this.backMenuList = [];
      this.lastBuildMenuTime = 0;
    },
    async changePermissionCode(userId: string) {
      const codeList = await getPermCodeByUserId({ userId });
      this.setPermCodeList(codeList);
    },
    async buildRoutesAction(id?: number | string): Promise<AppRouteRecordRaw[]> {
      const { t } = useI18n();
      const userStore = useUserStore();
      const appStore = useAppStoreWidthOut();

      let routes: AppRouteRecordRaw[] = [];
      const roleList = toRaw(userStore.getRoleList);
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
        const paramId = id || userStore.getUserInfo?.userId;

        // !Simulate to obtain permission codes from the background,
        // this function may only need to be executed once, and the actual project can be put at the right time by itself
        let routeList: AppRouteRecordRaw[] = [];
        try {
          this.changePermissionCode('1');
          routeList = (await getMenuListById({ id: paramId })) as AppRouteRecordRaw[];
        } catch (error) {
          console.error(error);
        }

        if (!paramId) {
          throw new Error('paramId is undefined!');
        }

        // Dynamically introduce components
        routeList = transformObjToRoute(routeList);

        //  Background routing to menu structure
        const backMenuList = transformRouteToMenu(routeList);
        this.setBackMenuList(backMenuList);

        routeList = flatMultiLevelRoutes(routeList);
        routes = [PAGE_NOT_FOUND_ROUTE, ...routeList];
      }
      routes.push(ERROR_LOG_ROUTE);
      return routes;
    },
  },
});

// Need to be used outside the setup
export function usePermissionStoreWidthOut() {
  return usePermissionStore(store);
}
