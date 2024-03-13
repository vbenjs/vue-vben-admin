import type { ErrorMessageMode } from '/#/axios';
import { defineStore } from 'pinia';
import { store } from '@/store';
import { PageEnum } from '@/enums/pageEnum';
import { TOKEN_KEY } from '@/enums/cacheEnum';
import { getAuthCache, setAuthCache } from '@/utils/auth';
import { LoginParams, LoginResultModel } from '@/ApiModel/system/userModel';
import { doLogout, loginApi } from '@/api/system/user';
import { useI18n } from '@/hooks/web/useI18n';
import { useMessage } from '@/hooks/web/useMessage';
import { router } from '@/router';
import { usePermissionStore } from '@/store/modules/permission';
import { RouteRecordRaw } from 'vue-router';
import { PAGE_NOT_FOUND_ROUTE } from '@/router/routes/basic';
import { h } from 'vue';
import { getAccountWithLogged } from '@/api/system/account';
import { Account, Permission as SysPermission } from '@/ApiModel/system/accountModel';
// import { useEnumStore } from './enum';
import { useAppStore } from './app';
import { useEnumStore } from './enum';

interface UserState {
  sessionTimeout?: boolean;
  lastUpdateTime: number;
  token?: string;
  name?: string; // 职员姓名
  username?: string;
  id?: number; // 职员id
  avatar: string;
  permission: Nullable<Permission>;
  userInfo: Nullable<Account>;
  loginErrortimes: number;
}

export interface Permission {
  permissionList: Array<string>;
  roles: Array<string>;
}

export const useUserStore = defineStore({
  id: 'app-user',
  state: (): UserState => ({
    name: undefined, // 职员姓名
    username: undefined,
    avatar: '',
    // user info
    userInfo: null,
    // token
    token: undefined,
    // roleList
    permission: null,
    // Whether the login expired
    sessionTimeout: false,
    // Last fetch time
    lastUpdateTime: 0,
    loginErrortimes: 0,
  }),
  getters: {
    getUserInfo(): { name: string; avatar: string; homePath?: string } {
      return {
        name: this?.name ?? this?.username ?? '',
        avatar: this.avatar,
        homePath: undefined,
      };
    },
    getToken(): string {
      return this.token || getAuthCache<string>(TOKEN_KEY);
    },
    getRoleList(): string[] {
      return this.permission?.permissionList ?? [];
    },
    getSysRoles(): string[] {
      return this.permission?.roles ?? [];
    },
    getIsAdmin(): boolean {
      return this.getSysRoles.includes('ADMIN');
    },
    getSessionTimeout(): boolean {
      return !!this.sessionTimeout;
    },
    getLastUpdateTime(): number {
      return this.lastUpdateTime;
    },
  },
  actions: {
    setToken(info: string | undefined) {
      this.token = info ? info : ''; // for null or undefined value
      setAuthCache(TOKEN_KEY, info);
    },
    setName(name: string, id: number) {
      this.name = name;
      this.id = id;
    },
    setUsername(username: string) {
      this.username = username;
    },
    setUserInfo(info: Account | null) {
      this.userInfo = info;
    },
    setAvatar(url: string) {
      this.avatar = url;
    },
    setRoles(account: Account) {
      const permissionList: string[] = [];
      const pushPermission = (code: string) => {
        if (permissionList.includes(code)) return;
        permissionList.push(code);
      };
      const codeJoin = (permissions?: SysPermission[] | null, parentCode?: string) => {
        permissions?.forEach((per: SysPermission) => {
          const code = (parentCode ? parentCode + '_' : '') + per.permissionCode;
          pushPermission(code);
          per.actionList?.forEach((action) => {
            pushPermission(code + '_' + action.actionCode);
          });
          codeJoin(per.children, code);
        });
      };
      codeJoin(account.permission.permissions);
      this.permission = {
        roles: account.roles?.map((role) => role.code) ?? [],
        permissionList,
      };
    },
    setSessionTimeout(flag: boolean) {
      this.sessionTimeout = flag;
    },
    resetState() {
      this.userInfo = null;
      this.name = undefined;
      this.username = undefined;
      this.avatar = '';
      this.token = '';
      this.permission = null;
      this.sessionTimeout = false;
    },
    /**
     * @description: login
     */
    async login(
      params: LoginParams & {
        mode?: ErrorMessageMode;
      },
    ): Promise<LoginResultModel> {
      try {
        const { mode, ...loginParams } = params;
        const { code, data, msg } = await loginApi(loginParams, mode);
        if (code === 0) {
          this.setToken('token');
          await this.afterLoginAction(true);
        }
        return { code, data, msg };
      } catch (error) {
        console.log(error);
        return Promise.reject(error);
      }
    },
    async afterLoginAction(goHome?: boolean): Promise<Account | null> {
      if (!this.getToken) return null;
      // get user info
      const userInfo = await this.getUserInfoAction();

      const sessionTimeout = this.sessionTimeout;
      if (sessionTimeout) {
        this.setSessionTimeout(false);
      } else {
        const permissionStore = usePermissionStore();

        // 动态路由加载（首次）
        if (!permissionStore.isDynamicAddedRoute) {
          const routes = await permissionStore.buildRoutesAction();
          [...routes, PAGE_NOT_FOUND_ROUTE].forEach((route) => {
            router.addRoute(route as unknown as RouteRecordRaw);
          });
          // 记录动态路由加载完成
          permissionStore.setDynamicAddedRoute(true);
        }

        goHome && (await router.replace(PageEnum.BASE_HOME));
      }
      return userInfo;
    },
    async getUserInfoAction(): Promise<Account | null> {
      if (!this.getToken) return null;
      const account = await getAccountWithLogged();

      if (account) {
        this.setUsername(account.username);
        this.setRoles(account);
        this.setUserInfo(account);
      }
      // useEnumStore().getEnumOptions();
      useAppStore().getVersion();
      return account;
    },
    /**
     * @description: logout
     */
    async logout(goLogin = false, isPost = true) {
      if (isPost && this.getToken) {
        try {
          await doLogout();
        } catch {
          console.log('注销Token失败');
        }
      }
      this.setToken(undefined);
      this.setSessionTimeout(false);
      this.resetState();
      this.setUserInfo(null);
      // clear();
      // goLogin && router.push({ path: PageEnum.BASE_LOGIN });
      if (goLogin) {
        // 直接回登陆页
        router.replace(PageEnum.BASE_LOGIN);
      } else {
        // 回登陆页带上当前路由地址
        router.replace({
          path: PageEnum.BASE_LOGIN,
          query: {
            redirect: encodeURIComponent(router.currentRoute.value.fullPath),
          },
        });
      }
    },

    /**
     * @description: Confirm before logging out
     */
    confirmLoginOut() {
      const { createConfirm } = useMessage();
      const { t } = useI18n();
      createConfirm({
        iconType: 'warning',
        title: () => h('span', t('sys.app.logoutTip')),
        content: () => h('span', t('sys.app.logoutMessage')),
        onOk: async () => {
          await this.logout(true);
        },
      });
    },
  },
});

// Need to be used outside the setup
export function useUserStoreWithOut() {
  return useUserStore(store);
}
