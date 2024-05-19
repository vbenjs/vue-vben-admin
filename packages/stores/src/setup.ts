import type { App } from 'vue';

import { createPinia } from 'pinia';

interface SetupStoreOptions {
  /**
   * @zh_CN 应用名,由于 @vben/stores 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名
   * 应用名将被用于持久化的前缀
   */
  cachePrefix?: string;
}

/**
 * @zh_CN 初始化pinia
 * @param app vue app 实例
 */
async function setupStore(app: App, options: SetupStoreOptions = {}) {
  const { createPersistedState } = await import('pinia-plugin-persistedstate');
  const pinia = createPinia();
  const { cachePrefix = 'vben-admin-pro' } = options;
  const env = import.meta.env.DEV ? 'dev' : 'prod';
  pinia.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `__${cachePrefix}-${storeKey}-${env}__`,
      storage: localStorage,
    }),
  );
  app.use(pinia);
}

export { setupStore };
