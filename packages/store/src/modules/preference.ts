import { acceptHMRUpdate, defineStore } from 'pinia';

/**
 * @description 偏好设置相关
 */
const usePreferenceStore = defineStore('shared-preference', {
  state: () => ({
    appName: 'vben-admin',
  }),
  getters: {
    getAppName(): string {
      return this.appName;
    },
  },
  actions: {
    setAppName(name: string) {
      this.appName = name;
    },
  },
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(usePreferenceStore, hot));
}

export { usePreferenceStore };
