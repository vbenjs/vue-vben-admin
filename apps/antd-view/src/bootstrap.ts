import '@vben/styles';

import { setupI18n } from '@vben/locales';
import { preference } from '@vben/preference';
import { setupStore } from '@vben/stores';
import { createApp } from 'vue';

import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app, { defaultLocale: preference.locale });

  // 配置 pinia-store
  await setupStore(app, { namespace });

  // 配置路由及路由守卫
  app.use(router);

  app.mount('#app');

  // production mock server
  if (import.meta.env.PROD) {
    import('./mock-prod-server').then(({ setupProdMockServer }) => {
      setupProdMockServer();
    });
  }
}

export { bootstrap };
