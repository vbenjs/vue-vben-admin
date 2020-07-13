import { RoleEnum } from '@/enums/roleEnum';

import { permissionStore } from '@/store/modules/permission';
import { isArray } from '@/utils/is/index';
import { routerInstance } from '@/router/index';

import { useTabs } from '@/hooks/functions/useTabs';
import { intersection } from '@/utils/lodashChunk';

export function useAuth() {
  /**
   * 判断是否显示
   */
  function hasAuth(roles?: RoleEnum | RoleEnum[], def = true): boolean {
    let hasRender = false;

    // ！不传默认可见
    if (!roles) {
      hasRender = def;
    } else if (!isArray(roles)) {
      hasRender = permissionStore.getRoleState.includes(roles);
    } else {
      hasRender = (intersection(roles, permissionStore.getRoleState) as RoleEnum[]).length > 0;
    }
    return hasRender;
  }

  /**
   * 更新角色
   * @param roles
   */
  function changeRole(roles: RoleEnum | RoleEnum[]): void {
    const { resetRouter } = routerInstance;
    if (!isArray(roles)) {
      roles = [roles];
    }
    permissionStore.commitRoleState(roles);
    // 重置路由
    resetRouter();

    // 动态添加路由
    const addRoutes = permissionStore.getRoutesState;
    if (addRoutes && addRoutes.length) {
      const { getRouteInstance } = routerInstance;
      getRouteInstance().addRoutes(addRoutes);
    }
    // 清空tabs
    const { closeOther } = useTabs();
    closeOther();
  }

  return { changeRole, hasAuth };
}
