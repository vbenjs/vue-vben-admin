import { appStore } from './../../store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { useTabs } from './useTabs';
import { RoleEnum } from '/@/enums/roleEnum';
import router, { resetRouter } from '/@/router';
import { userStore } from '/@/store/modules/user';
import { isArray } from '/@/utils/is';
import { RootRoute } from '/@/router/routes';
import type { RouteRecordRaw } from 'vue-router';
import { PermissionModeEnum } from '/@/enums/appEnum';
import { intersection } from 'lodash-es';

export function usePermission() {
  /**
   * 更换权限模式
   */
  async function togglePermissionMode() {
    appStore.commitProjectConfigState({
      permissionMode:
        appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROLE
          : PermissionModeEnum.BACK,
    });
    resume();
    // location.reload();
  }

  async function resume(id?: string | number) {
    resetRouter();
    const routes = await permissionStore.buildRoutesAction(id);
    routes.forEach((route) => {
      router.addRoute(RootRoute.name!, route as RouteRecordRaw);
    });
    permissionStore.commitLastBuildMenuTimeState();
    const {
      // closeAll,
      closeOther,
    } = useTabs();
    // closeAll();
    closeOther();
  }

  /**
   * 角色模式下判断是否显示
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    const permMode = appStore.getProjectConfig.permissionMode;
    if (PermissionModeEnum.ROLE === permMode) {
      // ！不传默认可见
      if (!value) {
        return def;
      }
      if (!isArray(value)) {
        return userStore.getRoleListState.includes(value as RoleEnum);
      }
      return (intersection(value, userStore.getRoleListState) as RoleEnum[]).length > 0;
    }
    if (PermissionModeEnum.BACK === permMode) {
      // ！不传默认可见
      if (!value) {
        return def;
      }
      const allCodeList = permissionStore.getPermCodeListState;
      if (!isArray(value)) {
        return allCodeList.includes(value as string);
      }
      return (intersection(value, allCodeList) as string[]).length > 0;
    }

    return true;
  }

  /**
   * 更新角色
   * @param roles
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (appStore.getProjectConfig.permissionMode !== PermissionModeEnum.ROLE) {
      throw new Error('请在配置中将PermissionModeEnum切换为ROLE模式在进行操作!');
    }
    if (!isArray(roles)) {
      roles = [roles];
    }
    userStore.commitRoleListState(roles);
    await resume();
  }

  /**
   *
   */
  async function changeMenu(id?: string | number) {
    // 这里传入id是为测试，实际可以不用传，会自动获取登录人的id
    resume(id);
  }

  return { changeRole, hasPermission, togglePermissionMode, changeMenu };
}
