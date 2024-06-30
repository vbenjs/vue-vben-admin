import { computed } from 'vue';

import { preferences } from '@vben-core/preferences';
import { useAccessStore } from '@vben-core/stores';

function useAccess() {
  const accessStore = useAccessStore();
  const currentAccessMode = computed(() => {
    return preferences.app.accessMode;
  });

  /**
   * 更改账号角色
   * @param roles
   */
  async function changeRoles(roles: string[]): Promise<void> {
    if (preferences.app.accessMode !== 'frontend') {
      throw new Error(
        'The current access mode is not frontend, so the role cannot be changed',
      );
    }
    accessStore.setUserRoles(roles);
  }

  return { changeRoles, currentAccessMode };
}

export { useAccess };
