import { preferences } from '@vben-core/preferences';
import type { Router } from 'vue-router';

import { $t } from '@vben/locales';
import { startProgress, stopProgress } from '@vben/utils';
import { useTitle } from '@vueuse/core';

import { configAccessGuard } from './access';

/**
 * 通用守卫配置
 * @param router
 */
function configCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach(async (to) => {
    // 页面加载进度条
    if (preferences.transition.progress) {
      startProgress();
    }
    to.meta.loaded = loadedPaths.has(to.path);
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行
    loadedPaths.add(to.path);

    // 关闭页面加载进度条
    if (preferences.transition.progress) {
      stopProgress();
    }

    // 动态修改标题
    if (preferences.app.dynamicTitle) {
      const { title } = to.meta;
      useTitle(`${$t(title)} - ${preferences.app.name}`);
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
