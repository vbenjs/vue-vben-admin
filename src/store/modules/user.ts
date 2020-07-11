import store from '@/store/index';
// import { unref } from 'compatible-vue';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';

// import { centerLoginApi, OrgLoginParams, CenterLoginParams } from '@/api/user';

import { PageEnum } from '@/enums/pageEnum';
import { TOKEN_KEY, USER_INFO_KEY, USER_IS_LOGIN_KEY } from '@/enums/cacheEnum';

import { routerInstance } from '@/router/index';

import { useMessage } from '@/hooks/core/useMessage';

import { permissionStore } from './permission';

import { loginApi } from '@/api/sys/login';
import { LoginParams, LoginResultModel } from '@/api/sys/model/loginModel';

import { setSession, getSession, clearSession } from '@/store/persistent';

export type UserInfo = Omit<LoginResultModel, 'roles'>;
export interface UserState {
  userInfoState: UserInfo | null;

  tokenState: string;
}

@Module({ namespaced: true, name: 'user', dynamic: true, store })
class User extends VuexModule implements UserState {
  // 用户信息
  userInfoState: UserInfo | null = null;

  // token
  tokenState = '';

  get getUserInfoState(): UserInfo {
    return this.userInfoState || (getSession(USER_INFO_KEY) as UserInfo) || {};
  }

  get getTokenState(): string {
    return this.tokenState || (getSession(TOKEN_KEY) as string);
  }

  @Mutation
  resetState(): void {
    this.userInfoState = null;
    this.tokenState = '';
    permissionStore.commitReset();
  }

  @Mutation
  commitIsLoginState(isLogin: boolean): void {
    setSession(USER_IS_LOGIN_KEY, isLogin);
  }

  @Mutation
  commitUserInfoState(info: UserInfo): void {
    this.userInfoState = info;
    if (info) {
      setSession(USER_INFO_KEY, info);
    }
  }

  @Mutation
  commitTokenState(info: string): void {
    this.tokenState = info;
    if (info) {
      setSession(TOKEN_KEY, info);
    }
  }

  /**
   * @description: 登录
   */
  @Action({ rawError: true })
  async login(params: LoginParams, goHome = true): Promise<boolean> {
    const data = await loginApi(params);
    const { token, roles } = data;

    const roleList: string[] = roles.map((item) => item.value);
    this.commitTokenState(token);
    // // 设置用户信息
    Reflect.deleteProperty(data, 'token');
    this.commitUserInfoState((data as unknown) as UserInfo);
    permissionStore.commitRoleState(roleList);

    this.commitIsLoginState(true);
    const { getRouteInstance } = routerInstance;
    goHome && getRouteInstance && getRouteInstance().push(PageEnum.BASE_HOME);
    return true;
  }

  /**
   * @description: 退出登录
   */
  @Action({ rawError: true })
  async loginOut(goLogin = false) {
    const { getRouteInstance, resetRouter } = routerInstance;

    resetRouter && resetRouter();
    clearSession();
    permissionStore.commitHasRouteState(false);
    permissionStore.commitReset();
    this.resetState();
    goLogin && getRouteInstance && getRouteInstance().replace(PageEnum.BASE_LOGIN);
  }

  /**
   * @description: 退出系统之前确认
   */
  @Action({ rawError: true })
  async confirmLoginOut() {
    const { createConfirm } = useMessage();
    createConfirm({
      iconType: 'warning',
      title: '温馨提醒',
      content: '是否确认退出系统?',
      onOk: async () => {
        await this.loginOut(true);
      },
    });
  }
}
export { User };
export const userStore = getModule<User>(User);
