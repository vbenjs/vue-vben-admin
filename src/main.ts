import { createApp } from 'vue';
import App from './App.vue';

import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupErrorHandle } from '/@/logics/error-handle';
import { setupGlobDirectives } from '/@/directives';
import { setupI18n } from '/@/locales/setupI18n';

import { registerGlobComp } from '/@/components/registerGlobComp';

import { isDevMode } from '/@/utils/env';

import '/@/design/index.less';

const app = createApp(App);

registerGlobComp(app);

// Multilingual configuration
setupI18n(app);

// Configure routing
setupRouter(app);

// Configure vuex store
setupStore(app);

// Register global directive
setupGlobDirectives(app);

// Configure global error handling
setupErrorHandle(app);

// Mount when the route is ready
router.isReady().then(() => {
  app.mount('#app', true);
});

// The development environment takes effect
if (isDevMode()) {
  app.config.performance = true;
  window.__APP__ = app;
}
