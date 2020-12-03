import type { Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';

import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';

import { useGlobSetting, useProjectSetting } from '/@/hooks/setting';

import { getIsOpenTab, getRoute } from '/@/router/helper/routeHelper';
import { setTitle } from '/@/utils/browser';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';

import { tabStore } from '/@/store/modules/tab';
import { useI18n } from '/@/hooks/web/useI18n';
import { REDIRECT_NAME } from '/@/router/constant';

const { closeMessageOnSwitch, removeAllHttpPending } = useProjectSetting();
const globSetting = useGlobSetting();

export function createGuard(router: Router) {
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }

  createPageLoadingGuard(router);
  router.beforeEach(async (to) => {
    // Determine whether the tab has been opened
    const isOpen = getIsOpenTab(to.fullPath);
    to.meta.inTab = isOpen;

    // Notify routing changes
    tabStore.commitLastChangeRouteState(getRoute(to));

    try {
      if (closeMessageOnSwitch) {
        Modal.destroyAll();
        notification.destroy();
      }
      // Switching the route will delete the previous request
      removeAllHttpPending && axiosCanceler!.removeAllPending();
    } catch (error) {
      console.warn('basic guard error:' + error);
    }
    return true;
  });

  router.afterEach((to) => {
    const { t } = useI18n();
    // change html title
    to.name !== REDIRECT_NAME && setTitle(t(to.meta.title), globSetting.title);
  });
  createProgressGuard(router);
  createPermissionGuard(router);
}
