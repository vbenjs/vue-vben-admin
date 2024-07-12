import { useCoreTabbarStore } from '@vben-core/stores';

import { defineStore } from 'pinia';

import { useAccessStore } from './access';

interface AppState {
  isLockScreen: boolean;
  lockScreenPassword?: string;
}

export const useAppStore = defineStore('app', {
  actions: {
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },

    resetAppState() {
      const accessStore = useAccessStore();
      const coreTabbarStore = useCoreTabbarStore();
      accessStore.reset();
      coreTabbarStore.$reset();
    },

    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
  },
  persist: {
    paths: ['isLockScreen', 'lockScreenPassword'],
  },
  state: (): AppState => ({
    isLockScreen: false,
    lockScreenPassword: undefined,
  }),
});
