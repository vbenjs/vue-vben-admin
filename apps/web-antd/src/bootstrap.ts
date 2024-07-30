import { createApp } from 'vue';

import { useAccessDirective } from '@vben/access';
import '@vben/styles';
import '@vben/styles/antd';

import { setupI18n } from '#/locales';
import { setupStore } from '#/store';

import App from './app.vue';
import { router } from './router';

async function bootstrap(namespace: string) {
  const app = createApp(App);

  // 国际化 i18n 配置
  await setupI18n(app);

  // 配置 pinia-tore
  await setupStore(app, { namespace });

  // 安装权限指令
  useAccessDirective(app);

  // 配置路由及路由守卫
  app.use(router);

  app.mount('#app');
}

export { bootstrap };
