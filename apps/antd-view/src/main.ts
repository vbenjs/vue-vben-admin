import '@vben-core/design/tailwind';

import '@vben-core/design';
import '@vben-core/design-tokens';

import { setupI18n } from '@vben/locales';
import { preference, setupPreference } from '@vben/preference';
import { setupStore } from '@vben/stores';
import { createApp } from 'vue';

import App from './app.vue';
import { overridesPreference } from './preference';
import { router } from './router';

async function bootstrap(cachePrefix: string) {
  // app偏好设置
  await setupPreference({
    cachePrefix,
    overrides: overridesPreference,
  });

  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app, { defaultLocale: preference.locale });

  // 配置 pinia-store
  await setupStore(app, { cachePrefix });

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

bootstrap('vben-admin-pro-antd');
