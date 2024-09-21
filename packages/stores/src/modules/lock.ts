import { defineStore } from 'pinia';

interface AppState {
  /**
   * 是否锁屏状态
   */
  isLockScreen: boolean;
  /**
   * 锁屏密码
   */
  lockScreenPassword?: string;
}

export const useLockStore = defineStore('core-lock', {
  actions: {
    lockScreen(password: string) {
      this.isLockScreen = true;
      this.lockScreenPassword = password;
    },

    unlockScreen() {
      this.isLockScreen = false;
      this.lockScreenPassword = undefined;
    },
  },
  persist: {
    pick: ['isLockScreen', 'lockScreenPassword'],
  },
  state: (): AppState => ({
    isLockScreen: false,
    lockScreenPassword: undefined,
  }),
});
