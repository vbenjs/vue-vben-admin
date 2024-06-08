import { createPinia } from 'pinia';

interface InitStoreOptions {
  /**
   * @zh_CN 应用名,由于 @vben-core/stores 是公用的，后续可能有多个app，为了防止多个app缓存冲突，可在这里配置应用名
   * 应用名将被用于持久化的前缀
   */
  namespace: string;
}

/**
 * @zh_CN 初始化pinia
 */
async function initStore(options: InitStoreOptions) {
  const { createPersistedState } = await import('pinia-plugin-persistedstate');
  const pinia = createPinia();
  const { namespace } = options;
  pinia.use(
    createPersistedState({
      // key $appName-$store.id
      key: (storeKey) => `${namespace}-${storeKey}`,
      storage: localStorage,
    }),
  );
  return pinia;
}

export { initStore };

export type { InitStoreOptions };
