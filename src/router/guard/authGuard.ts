import { NavigationGuard, Location } from 'vue-router/types/router';

import { PageEnum } from '@/enums/pageEnum';

import { getToken } from '@/utils/auth/index';
import { permissionStore } from '@/store/modules/permission';
// import { userStore } from '@/store/modules/user';

import { routerInstance } from '@/router/index';
export function createAuthGuard(): NavigationGuard {
  return (to, form, next) => {
    try {
      const token = getToken();

      if (!token) {
        // token不存在
        if (to.meta.ignoreAuth) {
          // 不用权限即可以访问 需要设置路由的meta.ignoreAuth为true
          next();
        } else {
          permissionStore.commitHasRouteState(false);
          // 跳转登录界面
          const redirectPath = to.path
            ? `${PageEnum.BASE_LOGIN}?redirect=${to.path}`
            : PageEnum.BASE_LOGIN;
          next(redirectPath);
        }
        return;
      }
      if ([PageEnum.BASE_LOGIN].includes(to.path as PageEnum)) {
        next();
        return;
      }

      // 已经请求过接口了
      if (permissionStore.getHasRouteState) {
        to.path === '/' ? next({ path: PageEnum.BASE_HOME, replace: true }) : next();
        return;
      }
      const addRoutes = permissionStore.getRoutesState;
      if (addRoutes && addRoutes.length) {
        const { getRouteInstance } = routerInstance;
        getRouteInstance().addRoutes(addRoutes);
        permissionStore.commitHasRouteState(true);
        const redirectPath = (form.query.redirect || to.path) as string;
        const redirect = decodeURIComponent(redirectPath);
        const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };

        next(nextData as Location);
      }
    } catch (error) {
      throw new Error(error);
    }
  };
}
