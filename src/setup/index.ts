import { VueConstructor } from 'vue';

import setupSvgIcon from '@/assets/icons/setupSvgIcon';

import Scrollbar from '@/components/scrollbar';

import '@/setup/ant-design-vue/index';
import '@/setup/ant-design-vue/spin';
import RunTimeVue from '@/setup/vue/setRunTimeVue';

//  vue3-composition
import VueCompositionAPI from '@/setup/vue';

import './freeze/freezeWindowConfig';
export default {
  install: (Vue: VueConstructor): void => {
    Vue.use(VueCompositionAPI);
    Vue.use(RunTimeVue);

    Vue.use(Scrollbar);
    // 使用svg sprit
    setupSvgIcon();
  },
};
