import type { Router } from 'vue-router';

import { preference } from '@vben/preference';
import { startProgress, stopProgress } from '@vben/utils';

import { configAccessGuard } from './access';

/**
 * 通用守卫配置
 * @param router
 */
function configCommonGuard(router: Router) {
  const loadedPaths = new Set<string>();

  router.beforeEach(async (to) => {
    if (preference.pageProgress) {
      startProgress();
    }
    to.meta.loaded = loadedPaths.has(to.path);
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行
    loadedPaths.add(to.path);
    if (preference.pageProgress) {
      stopProgress();
    }
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouteGuard(router: Router) {
  /** 通用 */
  configCommonGuard(router);
  /** 权限访问 */
  configAccessGuard(router);
}

export { createRouteGuard };
