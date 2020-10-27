import type { Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';
import { useSetting } from '/@/hooks/core/useSetting';
import { getIsOpenTab, setCurrentTo } from '/@/utils/helper/routeHelper';
import { setTitle } from '/@/utils/browser';

const { projectSetting, globSetting } = useSetting();
export function createGuard(router: Router) {
  const { openNProgress, closeMessageOnSwitch, removeAllHttpPending } = projectSetting;
  let axiosCanceler: AxiosCanceler | null;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async (to) => {
    const isOpen = getIsOpenTab(to.fullPath);
    to.meta.inTab = isOpen;
    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
      // TODO Some special interfaces require long connections
      // Switching the route will delete the previous request
      removeAllHttpPending && axiosCanceler!.removeAllPending();
    } catch (error) {
      console.warn('basic guard error:' + error);
    }
    setCurrentTo(to);
    return true;
  });

  router.afterEach((to) => {
    // change html title

    setTimeout(() => {
      setTitle(to.meta.title, globSetting.title);
    }, 0);
  });

  openNProgress && createProgressGuard(router);
  createPermissionGuard(router);
  createPageLoadingGuard(router);
}
