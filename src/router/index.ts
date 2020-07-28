import { Vue } from 'compatible-vue';
import Router from 'vue-router';
import { Position, Route } from 'vue-router/types/router';
import { repeatPatch } from './patch';
import { RouterOptionsPlus, CreateRouterOptions } from './types';
import { createMainOutRoutes } from './routes/index';
import sysRoutes from './routes/sys';
import { createGuard } from './guard/index';
repeatPatch(Router);

Vue.use(Router);

/**
 * @description:  创建路由实例
 */
const createRouter = (options: CreateRouterOptions = {}): Router => {
  return new Router({
    mode: 'hash',
    base: process.env.VUE_APP_PUBLIC_PATH,
    scrollBehavior: (to: Route, from: Route, savedPosition: void | Position) => {
      if (savedPosition) return savedPosition;
      if (to.hash) return { selector: to.hash };
      return { x: 0, y: 0 };
    },
    ...options,
  });
};
/**
 * @description: 路由实例对象
 */
class RouterInstance {
  routeInstance: Router;
  options: CreateRouterOptions;
  constructor(options: CreateRouterOptions) {
    // 创建路由实例
    this.routeInstance = createRouter(options);
    this.options = options;
    createGuard(this.routeInstance);
  }

  /**
   * @description: 获取路由实例
   */
  getRouteInstance = (): Router => {
    return this.routeInstance;
  };

  resetRouter = (): void => {
    const newRouter = createRouter(this.options) as RouterOptionsPlus;
    (this.routeInstance as RouterOptionsPlus).matcher = newRouter.matcher; // reset router
  };
}
const routeList = createMainOutRoutes([sysRoutes]);
export const routerInstance = new RouterInstance({
  routes: routeList,
});

export * from './routes';
