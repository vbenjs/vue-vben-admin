import type { Router } from 'vue-router';
import { setLastChangeTab } from '/@/logics/mitt/tabChange';

export function createPageGuard(router: Router) {
  const loadedPageMap = new Map<string, boolean>();

  router.beforeEach(async (to) => {
    to.meta.loaded = !!loadedPageMap.get(to.path);
    // Notify routing changes
    setLastChangeTab(to);

    return true;
  });

  router.afterEach((to) => {
    loadedPageMap.set(to.path, true);
  });
}
