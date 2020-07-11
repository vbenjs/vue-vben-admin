import { VueConstructor } from 'vue';
import { setRuntimeVM } from './runtimeVm';

export default {
  install(Vue: VueConstructor) {
    Vue.mixin({ beforeCreate: setRuntimeVM });
  },
};
