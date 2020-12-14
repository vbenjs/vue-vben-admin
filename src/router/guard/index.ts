import { RouteLocationNormalized, Router } from 'vue-router';

import { Modal, notification } from 'ant-design-vue';

import { createProgressGuard } from './progressGuard';
import { createPermissionGuard } from './permissionGuard';
import { createPageLoadingGuard } from './pageLoadingGuard';

import { useGlobSetting, useProjectSetting } from '/@/hooks/setting';

import { setTitle } from '/@/utils/browser';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';

import { useI18n } from '/@/hooks/web/useI18n';
import { REDIRECT_NAME } from '/@/router/constant';
import { setLastChangeTab } from '/@/logics/mitt/tabChange';

const { closeMessageOnSwitch, removeAllHttpPending } = useProjectSetting();
const globSetting = useGlobSetting();

const body = document.body;

const isHash = (href: string) => {
  return /^#/.test(href);
};

export function createGuard(router: Router) {
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // Notify routing changes
    setLastChangeTab(to);
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
    // scroll top
    isHash((to as RouteLocationNormalized & { href: string })?.href) && body.scrollTo(0, 0);

    loadedPageMap.set(to.path, true);

    const { t } = useI18n();

    // change html title
    to.name !== REDIRECT_NAME && setTitle(t(to.meta.title), globSetting.title);
  });
  createPageLoadingGuard(router);
  createProgressGuard(router);
  createPermissionGuard(router);
}
