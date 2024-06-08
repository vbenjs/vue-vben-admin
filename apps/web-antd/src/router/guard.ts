import { generatorMenus, generatorRoutes } from '@vben-core/helpers';
import { preferences } from '@vben-core/preferences';
import { useAccessStore } from '@vben-core/stores';
import type { RouteLocationNormalized, Router } from 'vue-router';

import { LOGIN_PATH } from '@vben/constants';
import { $t } from '@vben/locales';
import { startProgress, stopProgress } from '@vben/utils';
import { useTitle } from '@vueuse/core';

import { dynamicRoutes } from '@/router/routes';

/**
 * 通用守卫配置
 * @param router
 */
function setupCommonGuard(router: Router) {
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
 * 权限访问守卫配置
 * @param router
 */
function setupAccessGuard(router: Router) {
  router.beforeEach(async (to, from) => {
    const accessStore = useAccessStore();
    const accessToken = accessStore.getAccessToken;

    // accessToken 检查
    if (!accessToken) {
      if (to.path === '/') {
        return loginPageMeta(to);
      }

      // 明确声明忽略权限访问权限，则可以访问
      if (to.meta.ignoreAccess) {
        return true;
      }

      // 没有访问权限，跳转登录页面
      if (to.fullPath !== LOGIN_PATH) {
        return loginPageMeta(to);
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
    const routes = await generatorRoutes(dynamicRoutes, userRoles);
    // 动态添加到router实例内
    routes.forEach((route) => router.addRoute(route));

    const menus = await generatorMenus(routes, router);

    // 保存菜单信息和路由信息
    accessStore.setAccessMenus(menus);
    accessStore.setAccessRoutes(routes);
    const redirectPath = (from.query.redirect ?? to.path) as string;

    return {
      path: decodeURIComponent(redirectPath),
      replace: true,
    };
  });
}

/**
 * 登录页面信息
 * @param to
 */
function loginPageMeta(to: RouteLocationNormalized) {
  return {
    path: LOGIN_PATH,
    // 如不需要，直接删除 query
    query: { redirect: encodeURIComponent(to.fullPath) },
    // 携带当前跳转的页面，登录后重新跳转该页面
    replace: true,
  };
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
