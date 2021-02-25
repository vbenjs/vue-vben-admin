import type { RouteRecordRaw } from 'vue-router';

import { appStore } from '/@/store/modules/app';
import { permissionStore } from '/@/store/modules/permission';
import { userStore } from '/@/store/modules/user';

import { useTabs } from './useTabs';

import router, { resetRouter } from '/@/router';
// import { RootRoute } from '/@/router/routes';

import { PermissionModeEnum } from '/@/enums/appEnum';
import { RoleEnum } from '/@/enums/roleEnum';

import { intersection } from 'lodash-es';
import { isArray } from '/@/utils/is';
import { tabStore } from '/@/store/modules/tab';

// User permissions related operations
export function usePermission() {
  /**
   * Change permission mode
   */
  async function togglePermissionMode() {
    appStore.commitProjectConfigState({
      permissionMode:
        appStore.getProjectConfig.permissionMode === PermissionModeEnum.BACK
          ? PermissionModeEnum.ROLE
          : PermissionModeEnum.BACK,
    });
    location.reload();
  }

  /**
   * Reset and regain authority resource information
   * @param id
   */
  async function resume(id?: string | number) {
    tabStore.commitClearCache();
    resetRouter();
    const routes = await permissionStore.buildRoutesAction(id);
    routes.forEach((route) => {
      router.addRoute((route as unknown) as RouteRecordRaw);
    });
    permissionStore.commitLastBuildMenuTimeState();
    const { closeAll } = useTabs();
    closeAll();
  }

  /**
   * Determine whether there is permission
   */
  function hasPermission(value?: RoleEnum | RoleEnum[] | string | string[], def = true): boolean {
    const permMode = appStore.getProjectConfig.permissionMode;
    if (PermissionModeEnum.ROLE === permMode) {
      // Visible by default
      if (!value) {
        return def;
      }
      if (!isArray(value)) {
        return userStore.getRoleListState.includes(value as RoleEnum);
      }
      return (intersection(value, userStore.getRoleListState) as RoleEnum[]).length > 0;
    }
    if (PermissionModeEnum.BACK === permMode) {
      // Visible by default
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
   * Change roles
   * @param roles
   */
  async function changeRole(roles: RoleEnum | RoleEnum[]): Promise<void> {
    if (appStore.getProjectConfig.permissionMode !== PermissionModeEnum.ROLE) {
      throw new Error(
        'Please switch PermissionModeEnum to ROLE mode in the configuration to operate!'
      );
    }
    if (!isArray(roles)) {
      roles = [roles];
    }
    userStore.commitRoleListState(roles);
    await resume();
  }

  /**
   * Change menu
   */
  async function changeMenu(id?: string | number) {
    // TODO The id passed in here is for testing. Actually, you don’t need to pass it. The id of the login person will be automatically obtained.
    resume(id);
  }

  return { changeRole, hasPermission, togglePermissionMode, changeMenu };
}
