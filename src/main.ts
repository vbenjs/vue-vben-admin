import '/@/design/index.less';
import '@virtual/windi.css';

import { createApp } from 'vue';
import App from './App.vue';

import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupErrorHandle } from '/@/logics/error-handle';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';
import { registerGlobComp } from '/@/components/registerGlobComp';

// router-guard
import '/@/router/guard';

// Register icon Sprite
import 'vite-plugin-svg-icons/register';

// Do not introduce` on-demand in local development?
// In the local development for on-demand introduction, the number of browser requests will increase by about 20%.
// Which may slow down the browser refresh.
// Therefore, all are introduced in local development, and only introduced on demand in the production environment
if (import.meta.env.DEV) {
  import('ant-design-vue/dist/antd.less');
}

(async () => {
  const app = createApp(App);
  // Register global components
  registerGlobComp(app);

  // Multilingual configuration
  await setupI18n(app);

  // Configure routing
  setupRouter(app);

  // Configure vuex store
  setupStore(app);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  // Mount when the route is ready
  // https://next.router.vuejs.org/api/#isready
  await router.isReady();

  app.mount('#app', true);

  if (import.meta.env.DEV) {
    window.__APP__ = app;
  }
})();
