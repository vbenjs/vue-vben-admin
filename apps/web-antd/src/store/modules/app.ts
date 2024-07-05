import { useCoreAccessStore, useCoreTabbarStore } from '@vben-core/stores';

import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', () => {
  const coreStoreAccess = useCoreAccessStore();
  const coreTabbarStore = useCoreTabbarStore();

  /**
   * 重置所有 状态
   */
  async function resetAppState() {
    coreStoreAccess.$reset();
    coreTabbarStore.$reset();
  }

  return {
    resetAppState,
  };
});
