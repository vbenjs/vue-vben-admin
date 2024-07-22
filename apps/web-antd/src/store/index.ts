import type { InitStoreOptions } from '@vben/stores';

import type { App } from 'vue';

import { initStore, resetAllStores, storeToRefs } from '@vben/stores';

/**
 * @zh_CN 初始化pinia
 * @param app vue app 实例
 */
async function setupStore(app: App, options: InitStoreOptions) {
  const pinia = await initStore(options);
  app.use(pinia);
}

export { resetAllStores, setupStore, storeToRefs };

export { useAccessStore } from './modules/access';
