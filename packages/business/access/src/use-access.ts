import { computed } from 'vue';

import { preferences } from '@vben-core/preferences';
import { useCoreAccessStore } from '@vben-core/stores';

function useAccess() {
  const coreAccessStore = useCoreAccessStore();
  const accessMode = computed(() => {
    return preferences.app.accessMode;
  });

  /**
   * 基于角色判断是否有权限
   * @description: Determine whether there is permission，The role is judged by the user's role
   * @param roles
   */
  function hasAuthByRole(roles: string[]) {
    const userRoleSet = new Set(coreAccessStore.getUserRoles);
    const intersection = roles.filter((item) => userRoleSet.has(item));
    return intersection.length > 0;
  }

  return { accessMode, hasAuthByRole };
}

export { useAccess };
