import { createApp } from 'vue';

import '@vben/styles';
import '@vben/styles/antd';
import { preferences } from '@vben-core/preferences';

import { loadMessages, setupI18n } from '#/locales';
import { setupStore } from '#/store';

import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app, {
    defaultLocale: preferences.app.locale,
    loadMessages,
    missingWarn: !import.meta.env.PROD,
  });

  // 配置 pinia-store
  await setupStore(app, { namespace });

  // 配置路由及路由守卫
  app.use(router);

  app.mount('#app');
}

export { bootstrap };
