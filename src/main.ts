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

setupDirectives(app);

setupErrorHandle(app);

router.isReady().then(() => {
  app.mount('#app');
});

if (isDevMode()) {
  app.config.performance = true;
  window.__APP__ = app;
}

if (isProdMode() && isUseMock()) {
  setupProdMockServer();
}

setApp(app);
