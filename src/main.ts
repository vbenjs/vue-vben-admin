import { createApp } from 'vue';

import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import { setupAntd } from '/@/setup/ant-design-vue';
import { setupErrorHandle } from '/@/setup/error-handle/index';
import { setupDirectives } from '/@/setup/directives/index';

import { isDevMode, isProdMode, isUseMock } from '/@/utils/env';
import { setupProdMockServer } from '../mock/_createProductionServer';
import { setApp } from './useApp';

import App from './App.vue';
import '/@/design/index.less';

const app = createApp(App);

// ui
setupAntd(app);
// router
setupRouter(app);
// store
setupStore(app);

// Directives
setupDirectives(app);

// error-handle
setupErrorHandle(app);

router.isReady().then(() => {
  app.mount('#app');
});

if (isDevMode()) {
  app.config.performance = true;
  window.__APP__ = app;
}

// If you do not need to use the mock service in the production environment, you can comment the code
if (isProdMode() && isUseMock()) {
  setupProdMockServer();
}

// Used to share app instances in other modules
setApp(app);
