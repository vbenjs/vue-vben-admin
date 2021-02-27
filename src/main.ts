import '/@/design/index.less';
import 'windi.css';

import { createApp } from 'vue';
import App from './App.vue';

import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupErrorHandle } from '/@/logics/error-handle';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';

import { registerGlobComp } from '/@/components/registerGlobComp';

import { isDevMode } from '/@/utils/env';

(async () => {
  const app = createApp(App);

  // Register global components
  registerGlobComp(app);

  // Configure routing
  setupRouter(app);

  // Configure vuex store
  setupStore(app);

  // Register global directive
  setupGlobDirectives(app);

  // Configure global error handling
  setupErrorHandle(app);

  await Promise.all([
    // Multilingual configuration
    setupI18n(app),
    // Mount when the route is ready
    router.isReady(),
  ]);

  app.mount('#app', true);

  // The development environment takes effect
  if (isDevMode()) {
    app.config.performance = true;
    window.__APP__ = app;
  }
})();
