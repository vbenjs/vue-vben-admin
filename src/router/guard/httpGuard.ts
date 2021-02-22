import type { Router } from 'vue-router';
import { useProjectSetting } from '/@/hooks/setting';
import { AxiosCanceler } from '/@/utils/http/axios/axiosCancel';

/**
 * The interface used to close the current page to complete the request when the route is switched
 * @param router
 */
export function createHttpGuard(router: Router) {
  const { removeAllHttpPending } = useProjectSetting();
  let axiosCanceler: Nullable<AxiosCanceler>;
  if (removeAllHttpPending) {
    axiosCanceler = new AxiosCanceler();
  }
  router.beforeEach(async () => {
    // Switching the route will delete the previous request
    removeAllHttpPending && axiosCanceler?.removeAllPending();
    return true;
  });
}
