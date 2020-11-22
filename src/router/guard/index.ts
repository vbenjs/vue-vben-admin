import type { Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';

import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';

import { useGlobSetting, useProjectSetting } from '/@/settings/use';

import { getIsOpenTab, setCurrentTo } from '/@/utils/helper/routeHelper';
import { setTitle } from '/@/utils/browser';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';

import { tabStore } from '/@/store/modules/tab';

const globSetting = useGlobSetting();
export function createGuard(router: Router) {
  const { openNProgress, closeMessageOnSwitch, removeAllHttpPending } = useProjectSetting();
  let axiosCanceler: AxiosCanceler | null;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }

  createPageLoadingGuard(router);
  router.beforeEach(async (to) => {
    // Determine whether the tab has been opened
    const isOpen = getIsOpenTab(to.fullPath);
    to.meta.inTab = isOpen;

    // Notify routing changes
    const { fullPath, path, query, params, name, meta } = to;
    tabStore.commitLastChangeRouteState({
      fullPath,
      path,
      query,
      params,
      name,
      meta,
    } as any);

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
    setTitle(to.meta.title, globSetting.title);
  });

  openNProgress && createProgressGuard(router);
  createPermissionGuard(router);
}
