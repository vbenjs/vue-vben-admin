import { RoleEnum } from '@/enums/roleEnum';
import { AuthModeEnum } from '@/enums/appEnum';

import { permissionStore } from '@/store/modules/permission';
import { appStore } from '@/store/modules/app';
import { menuStore } from '@/store/modules/menu';

import { isArray } from '@/utils/is/index';
import { routerInstance, getAsyncRoutes } from '@/router/index';
import { sort } from '@/router/helper/routeHelper';
import { buildMenuModule, transformRouteToMenu } from '@/router/helper/menuHelper';
import { BuildMenuModuleResult, RouteConfigEx } from '@/router/types';

import { useTabs } from '@/hooks/functions/useTabs';
import { intersection } from '@/utils/lodashChunk';

/**
 * 将对象转化为路由
 */

export async function buildMenuList(): Promise<BuildMenuModuleResult> {
  const { getProjCfg } = appStore;
  const { authMode } = getProjCfg;

  // 基于角色
  if (authMode === AuthModeEnum.ROLE) {
    const { flatMenus, allMenus } = buildMenuModule(getAsyncRoutes());
    const menus = sort(allMenus);
    return {
      allMenus: menus,
      flatMenus,
    };
  }

  // 后台获取菜单
  if (authMode === AuthModeEnum.BACK) {
    const rootRoutes = permissionStore.getRoutesState.find((item) => item.path === '/')!.children;
    const { allMenus, flatMenus } = transformRouteToMenu(rootRoutes!);
    return {
      allMenus,
      flatMenus: flatMenus,
    };
  }
  return {
    allMenus: [],
    flatMenus: [],
  };
}
export function useAuth() {
  /**
   * 更换权限模式
   */
  async function toggleAuthMode() {
    appStore.commitProjCfgState({
      authMode:
        appStore.getProjCfg.authMode === AuthModeEnum.BACK ? AuthModeEnum.ROLE : AuthModeEnum.BACK,
    });
    // if (appStore.getProjCfg.authMode === AuthModeEnum.BACK) {
    await permissionStore.buildRoutesAction();
    // }
    menuStore.commitLastBuildTimeState(new Date().getTime());
  }
  /**
   * 角色模式下判断是否显示
   */
  function hasRoleAuth(roles?: RoleEnum | RoleEnum[], def = true): boolean {
    // ！不传默认可见
    if (!roles) {
      return def;
    }
    if (!isArray(roles)) {
      return permissionStore.getRoleState.includes(roles);
    }
    return (intersection(roles, permissionStore.getRoleState) as RoleEnum[]).length > 0;
  }

  /**
   * 后台模式下判断是否显示
   * @param code
   * @param def
   */
  function hasCodeAuth(code, def = true): boolean {
    // ！不传默认可见
    if (!code) {
      return def;
    }
    const allCodeList = permissionStore.getPermCodeListState;
    const isPerm = allCodeList.includes(code);
    return isPerm;
  }

  function resume(addRoutes: RouteConfigEx[]) {
    const { resetRouter } = routerInstance;
    // 重置路由
    resetRouter();
    if (addRoutes && addRoutes.length) {
      const { getRouteInstance } = routerInstance;
      getRouteInstance().addRoutes(addRoutes);
    }
    // 清空tabs
    const { closeOther } = useTabs();
    closeOther();
  }
  /**
   * 更新角色
   * @param roles
   */
  function changeRole(roles: RoleEnum | RoleEnum[]): void {
    if (!isArray(roles)) {
      roles = [roles];
    }
    permissionStore.commitRoleState(roles);
    // 动态添加路由
    const addRoutes = permissionStore.getRoutesState;
    resume(addRoutes);
  }

  /**
   *
   */
  async function changeMenu(id: string | number) {
    // 这里传入id是为测试，实际可以不用传，会自动获取登陆人的id
    const addRoutes = await permissionStore.buildRoutesAction(id);
    resume(addRoutes);
    menuStore.commitLastBuildTimeState(new Date().getTime());
  }

  return { changeMenu, changeRole, hasCodeAuth, hasRoleAuth, toggleAuthMode };
}
