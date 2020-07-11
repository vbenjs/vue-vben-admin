import { VNode, Vue } from 'compatible-vue';
import App from './App.vue';

// setup
import Setup from '@/setup/index';

// utils
import { isDevMode } from '@/utils/envUtil';

import { CreateAppOptions } from './types';

export function createMain({ router, store, AppComponent = App }: CreateAppOptions) {
  // 项目配置
  Vue.use(Setup);

  Vue.config.productionTip = false;

  const app = new Vue({
    router,
    store,
    render: (h): VNode => h(AppComponent),
  }).$mount('#app');

  if (isDevMode()) {
    Vue.config.devtools = true;
    window.__app__ = app;
  }
  return app;
}
