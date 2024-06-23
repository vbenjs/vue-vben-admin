import type { Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { $t } from '@vben/locales';
import { startProgress, stopProgress } from '@vben/utils';
import { generatorMenus, generatorRoutes } from '@vben-core/helpers';
import { preferences } from '@vben-core/preferences';
import { useAccessStore } from '@vben-core/stores';

import { useTitle } from '@vueuse/core';

import { dynamicRoutes, essentialsRouteNames } from '#/router/routes';

const forbiddenPage = () => import('#/views/_essential/fallback/forbidden.vue');

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
  // 记录已经加载的页面
  const loadedPaths = new Set<string>();

  router.beforeEach(async (to) => {
    to.meta.loaded = loadedPaths.has(to.path);

    // 页面加载进度条
    if (!to.meta.loaded && preferences.transition.progress) {
      startProgress();
    }
    return true;
  });

  router.afterEach((to) => {
    // 记录页面是否加载,如果已经加载，后续的页面切换动画等效果不在重复执行

    if (preferences.tabbar.enable) {
      loadedPaths.add(to.path);
    }

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
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const accessToken = accessStore.getAccessToken;

    // accessToken 检查
    if (!accessToken) {
      if (
        // 基本路由，这些路由不需要进入权限拦截
        essentialsRouteNames.includes(to.name as string) ||
        // 明确声明忽略权限访问权限，则可以访问
        to.meta.ignoreAccess
      ) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return {
          path: LOGIN_PATH,
          // 如不需要，直接删除 query
          query: { redirect: encodeURIComponent(to.fullPath) },
          // 携带当前跳转的页面，登录后重新跳转该页面
          replace: true,
        };
      }
      return to;
    }

    const accessRoutes = accessStore.getAccessRoutes;

    // 是否已经生成过动态路由
    if (accessRoutes && accessRoutes.length > 0) {
      return true;
    }

    // 生成路由表
    // 当前登录用户拥有的角色标识列表
    const userRoles = accessStore.getUserRoles;

    const accessibleRoutes = await generatorRoutes(
      dynamicRoutes,
      userRoles,
      // 如果 route.meta.menuVisibleWithForbidden = true
      // 则会在菜单中显示，但是访问会被重定向到403
      // 这里可以指定403页面
      forbiddenPage,
    );
    // 动态添加到router实例内
    accessibleRoutes.forEach((route) => router.addRoute(route));

    // 生成菜单
    const menus = await generatorMenus(accessibleRoutes, router);

    // 保存菜单信息和路由信息
    accessStore.setAccessMenus(menus);
    accessStore.setAccessRoutes(accessibleRoutes);
    const redirectPath = (from.query.redirect ?? to.path) as string;

    return {
      path: decodeURIComponent(redirectPath),
      replace: true,
    };
  });
}

/**
 * 项目守卫配置
 * @param router
 */
function createRouterGuard(router: Router) {
  /** 通用 */
  setupCommonGuard(router);
  /** 权限访问 */
  setupAccessGuard(router);
}

export { createRouterGuard };
