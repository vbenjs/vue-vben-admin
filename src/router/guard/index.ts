import type { Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { createPageTitleGuard } from './pageTitleGuard';
import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';
import { useSetting } from '/@/hooks/core/useSetting';
import { getIsOpenTab } from '/@/utils/helper/routeHelper';

const { projectSetting } = useSetting();
export function createGuard(router: Router) {
  const axiosCanceler = new AxiosCanceler();

  router.beforeEach(async (to) => {
    const isOpen = getIsOpenTab(to.path);
    to.meta.inTab = isOpen;
    try {
      Modal.destroyAll();
      notification.destroy();
      // TODO Some special interfaces require long connections
      // Switching the route will delete the previous request
      axiosCanceler.removeAllPending();
    } catch (error) {
      console.warn('basic guard error:' + error);
    }
  });
  projectSetting.openNProgress && createProgressGuard(router);
  createPermissionGuard(router);
  createPageTitleGuard(router);
  createPageLoadingGuard(router);
}
