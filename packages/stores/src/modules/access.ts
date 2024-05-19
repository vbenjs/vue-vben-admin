import type { MenuRecordRaw, UserInfo } from '@vben-core/typings';

import type { RouteRecordRaw } from 'vue-router';

import { acceptHMRUpdate, defineStore } from 'pinia';

type AccessToken = null | string;

interface AccessState {
  /**
   * 可访问的菜单列表
   */
  accessMenus: MenuRecordRaw[];
  /**
   * 可访问的路由列表
   */
  accessRoutes: RouteRecordRaw[];
  /**
   * 登录 accessToken
   */
  accessToken: AccessToken;
  /**
   * 用户信息
   */
  userInfo: UserInfo | null;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 访问权限相关
 */
const useAccessStore = defineStore('access', {
  actions: {
    setAccessMenus(menus: MenuRecordRaw[]) {
      this.accessMenus = menus;
    },
    setAccessRoutes(routes: RouteRecordRaw[]) {
      this.accessRoutes = routes;
    },
    setAccessToken(token: AccessToken) {
      this.accessToken = token;
    },
    setUserInfo(userInfo: UserInfo) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      const roleValues = roles.map((item) => item.value);
      this.setUserRoles(roleValues);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
  },
  getters: {
    getAccessMenus(): MenuRecordRaw[] {
      return this.accessMenus;
    },
    getAccessRoutes(): RouteRecordRaw[] {
      return this.accessRoutes;
    },
    getAccessToken(): AccessToken {
      return this.accessToken;
    },
    getUserInfo(): UserInfo | null {
      return this.userInfo;
    },
    getUserRoles(): string[] {
      return this.userRoles;
    },
  },
  persist: {
    // 持久化
    // TODO: accessToken 过期时间
    paths: ['accessToken', 'userRoles', 'userInfo'],
  },
  state: (): AccessState => ({
    accessMenus: [],
    accessRoutes: [],
    accessToken: null,
    userInfo: null,
    userRoles: [],
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useAccessStore, hot));
}

export { useAccessStore };
