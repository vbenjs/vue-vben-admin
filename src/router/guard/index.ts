import Router from 'vue-router';
import { setPageTitleGuard } from './pageTitleGuard';
import { startProgressGuard, closeProgressGuard } from './progressGuard';
import { createAuthGuard } from './authGuard';
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';

/**
 * @description: 创建路由钩子
 */
export function createGuard(instance: Router) {
  const axiosCanceler = new AxiosCanceler();
  // beforeEach
  // 设置页面标题
  instance.beforeEach(setPageTitleGuard);
  instance.beforeEach(startProgressGuard);
  instance.beforeEach(createAuthGuard());
  instance.beforeEach((to, form, next) => {
    axiosCanceler.removeAllPending();
    next();
  });

  // beforeEach
  instance.afterEach(closeProgressGuard);
}
