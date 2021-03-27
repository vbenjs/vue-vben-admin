import type { Router } from 'vue-router';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';
import projectSetting from '/@/settings/projectSetting';

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = projectSetting;
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    axiosCanceler?.removeAllPending();
    return true;
  });
}
