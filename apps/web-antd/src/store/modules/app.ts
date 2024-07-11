import { useCoreTabbarStore } from '@vben-core/stores';

import { defineStore } from 'pinia';

import { useAccessStore } from './access';

export const useAppStore = defineStore('app', () => {
  const accessStore = useAccessStore();
  const coreTabbarStore = useCoreTabbarStore();

  /**
   * 重置所有状态
   */
  async function resetAppState() {
    accessStore.reset();
    coreTabbarStore.$reset();
  }

  return {
    resetAppState,
  };
});
