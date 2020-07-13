import { VueConstructor, Vue } from 'compatible-vue';
import { VueRouter } from 'vue-router/types/router';
import { Store } from 'vuex/types/index';

export interface CreateAppOptions {
  router: VueRouter | undefined;
  store: Store<any> | undefined;
  AppComponent?: VueConstructor<Vue> | any;
}
