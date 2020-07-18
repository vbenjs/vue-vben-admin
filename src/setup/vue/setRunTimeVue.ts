import { VueConstructor } from 'compatible-vue';

import { setRuntimeVM } from './runtimeVm';

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({ beforeCreate: setRuntimeVM });
  },
};
