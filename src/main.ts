import { createApp } from 'vue';
import { setupAntd } from '/@/setup/ant-design-vue';
import router, { setupRouter } from '/@/router';
import { setupStore } from '/@/store';
import App from './App.vue';
import { registerGlobComp } from '/@/components/registerGlobComp';
import { setupDirectives } from '/@/setup/directives/index';

import { isDevMode, isProdMode, isUseMock } from '/@/utils/env';

import { setupProdMockServer } from '../mock/_createProductionServer';
import '/@/design/index.less';
import '/@/design/main.postcss';

const app = createApp(App);

// ui
setupAntd(app);
// router
setupRouter(app);
// store
setupStore(app);

registerGlobComp(app);

setupDirectives(app);

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
export default app;
