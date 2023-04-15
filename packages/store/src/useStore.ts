import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';
import type { App } from 'vue';

interface UseStoreOptions {
  /**
   * @description 应用名,由于 @vben/store 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名
   * 应用名将被用于持久化的前缀
   */
  appName?: string;
}

/**
 * @description 初始化pinia
 * @param app vue app 实例
 */
function useStore(app: App, options: UseStoreOptions = {}) {
  const pinia = createPinia();
  const { appName = 'vben-admin' } = options;
  pinia.use(
    createPersistedState({
      storage: localStorage,
      // key $store.id-$appName
      key: (storeKey) => `${storeKey}${appName ? `-${appName}` : ''}`,
    }),
  );
  app.use(pinia);
}

export { useStore };
