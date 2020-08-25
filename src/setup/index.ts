import VueCompositionAPI, { VueConstructor } from 'compatible-vue';

import setupSvgIcon from '@/assets/icons/setupSvgIcon';

// import Scrollbar from '@/components/scrollbar';

import '@/setup/ant-design-vue/index';
import '@/setup/ant-design-vue/spin';
// import RunTimeVue from '@/setup/vue/setRunTimeVue';

import './freeze/freezeWindowConfig';

import { registerScriptErrorHandler } from '@/common/plugins/error-handle/index';
export default {
  install: (Vue: VueConstructor): void => {
    Vue.use(VueCompositionAPI);
    // Vue.use(RunTimeVue);

    // Vue.use(Scrollbar);
    // 使用svg sprit
    setupSvgIcon();
    // error handler
    registerScriptErrorHandler();
  },
};
