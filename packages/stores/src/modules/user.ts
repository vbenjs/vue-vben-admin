import { acceptHMRUpdate, defineStore } from 'pinia';

interface BasicUserInfo {
  [key: string]: any;
  /**
   * 头像
   */
  avatar: string;
  /**
   * 用户id
   */
  id: number;
  /**
   * 用户昵称
   */
  realName?: string;
  /**
   * 角色名
   */
  roleRemark: string;
  /**
   * 角色
   */
  roles: string[];
  /**
   * 用户名
   */
  username: string;
}

interface AccessState {
  /**
   * 用户信息
   */
  userInfo: BasicUserInfo | null;
  userRoleName: string;
  /**
   * 用户角色
   */
  userRoles: string[];
}

/**
 * @zh_CN 用户信息相关
 */
export const useUserStore = defineStore('core-user', {
  actions: {
    setUserInfo(userInfo: BasicUserInfo | null) {
      // 设置用户信息
      this.userInfo = userInfo;
      // 设置角色信息
      const roles = userInfo?.roles ?? [];
      // 设置角色名称
      const roleName = userInfo?.roleRemark ?? '';
      this.setUserRoles(roles);
      this.setUserRoleName(roleName);
    },
    setUserRoles(roles: string[]) {
      this.userRoles = roles;
    },
    setUserRoleName(name: string) {
      this.userRoleName = name;
    },
  },
  state: (): AccessState => ({
    userInfo: null,
    userRoles: [],
    userRoleName: '',
  }),
});

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserStore, hot));
}
