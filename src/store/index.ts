import { Vue } from 'compatible-vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import { isDevMode } from '@/utils/envUtil';
Vue.use(Vuex);

const plugins = [];

export default new Vuex.Store({
  // !这里只引入静态模块, 动态模块不要引入,动态模块直接import相应模块即可
  // modules,
  strict: isDevMode(),
  plugins: isDevMode() ? [createLogger()].concat(plugins) : plugins,
});
