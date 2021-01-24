import type { Router } from 'vue-router';
import { appStore } from '/@/store/modules/app';
import { PageEnum } from '/@/enums/pageEnum';
import { removeTabChangeListener } from '/@/logics/mitt/tabChange';

export function createStateGuard(router: Router) {
  router.afterEach((to) => {
    // Just enter the login page and clear the authentication information
    if (to.path === PageEnum.BASE_LOGIN) {
      appStore.resumeAllState();
      removeTabChangeListener();
    }
  });
}
