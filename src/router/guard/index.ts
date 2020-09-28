import type { Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import { createPageTitleGuard } from './pageTitleGuard';
import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';

const axiosCanceler = new AxiosCanceler();
export function createGuard(router: Router) {
  router.beforeEach(async () => {
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
  createProgressGuard(router);
  createPermissionGuard(router);
  createPageTitleGuard(router);
  createPageLoadingGuard(router);
}
