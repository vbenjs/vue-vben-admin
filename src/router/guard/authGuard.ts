import { NavigationGuard, Location } from 'vue-router/types/router';

import { pageEnum } from '@/enums/pageEnum';

import { getToken } from '@/utils/auth/index';
import { permissionStore } from '@/store/modules/permission';
import { setPageTitleGuard } from './pageTitleGuard';
import { startProgressGuard } from './progressGuard';
import { AxiosCanceler } from '@/utils/http/axios/axiosCancel';
import { Modal } from 'ant-design-vue';
import { routerInstance } from '@/router/index';
// import { userStore } from '@/store/modules/user';

const axiosCanceler = new AxiosCanceler();

export function createAuthGuard(): NavigationGuard {
  return (to, form, next) => {
    setTimeout(() => {
      setPageTitleGuard(to, form, next);
      Modal.destroyAll();
    }, 0);
    axiosCanceler.removeAllPending();
    startProgressGuard();
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
            ? `${pageEnum.BASE_LOGIN}?redirect=${to.path}`
            : pageEnum.BASE_LOGIN;
          next(redirectPath);
        }
        return;
      }

      if ([pageEnum.BASE_LOGIN].includes(to.path as pageEnum)) {
        next();
        return;
      }

      // 已经请求过接口了
      if (permissionStore.getHasRouteState) {
        to.path === '/' ? next({ path: pageEnum.BASE_HOME, replace: true }) : next();
        return;
      }

      permissionStore.buildRoutesAction().then((addRoutes) => {
        if (addRoutes && addRoutes.length) {
          const { getRouteInstance } = routerInstance;
          getRouteInstance().addRoutes(addRoutes);
          permissionStore.commitHasRouteState(true);
          const redirectPath = (form.query.redirect || to.path) as string;
          const redirect = decodeURIComponent(redirectPath);
          const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
          next(nextData as Location);
        }
      });
    } catch (error) {
      throw new Error(error);
    }
  };
}
