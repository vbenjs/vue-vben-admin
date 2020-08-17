import Router from 'vue-router';
// import { setPageTitleGuard } from './pageTitleGuard';
import {
  // startProgressGuard,
  closeProgressGuard,
} from './progressGuard';
import { createAuthGuard } from './authGuard';

/**
 * @description: 创建路由钩子
 */
export function createGuard(instance: Router) {
  // beforeEach
  // 设置页面标题
  // instance.beforeEach(setPageTitleGuard);
  // instance.beforeEach(startProgressGuard);
  instance.beforeEach(createAuthGuard());
  // instance.beforeEach((to, form, next) => {
  // axiosCanceler.removeAllPending();
  // Modal.destroyAll();
  //   next();
  // });

  // beforeEach
  instance.afterEach(closeProgressGuard);
}
