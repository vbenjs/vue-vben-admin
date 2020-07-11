import Router from 'vue-router';

/**
 * 修复路由重复点击报错问题
 * @param router
 */
export function repeatPatch(router: typeof Router) {
  // see: https://github.com/vuejs/vue-router/issues/2881
  const originalPush = router.prototype.push;
  // @ts-ignore
  router.prototype.push = function push(location, onResolve, onReject) {
    if (onResolve || onReject) {
      return originalPush.call(this, location, onResolve, onReject);
    }
    try {
      (originalPush.call(this, location) as any).catch((error) => error);
    } catch (error) {
      throw new Error(error);
    }
  };
}
