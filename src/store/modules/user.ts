import store from '@/store/index';
// import { unref } from 'compatible-vue';
import { VuexModule, Module, getModule, Mutation, Action } from 'vuex-module-decorators';
import { hotModuleUnregisterModule } from '@/store/util';

// import { centerLoginApi, OrgLoginParams, CenterLoginParams } from '@/api/user';

import { pageEnum } from '@/enums/pageEnum';
import { RoleEnum } from '@/enums/roleEnum';
import { TOKEN_KEY, USER_INFO_KEY } from '@/enums/cacheEnum';

import { routerInstance } from '@/router/index';

import { useMessage } from '@/hooks/core/useMessage';

import { permissionStore } from './permission';
import { tabStore } from './tab';

import { loginApi, getUserInfoById } from '@/api/sys/user';
import {
  LoginParams,
  GetUserInfoByUserIdModel,
  GetUserInfoByUserIdParams,
} from '@/src/api/sys/model/userModel';

import { setSession, getSession, clearSession } from '@/store/persistent';

export type UserInfo = Omit<GetUserInfoByUserIdModel, 'roles'>;
export interface UserState {
  userInfoState: UserInfo | null;

  tokenState: string;
}

const NAME = 'user';
hotModuleUnregisterModule(NAME);
@Module({ namespaced: true, name: NAME, dynamic: true, store })
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
    const { token, userId } = data;
    // 获取用户信息
    await this.getUserInfoAction({ userId });

    // 存储token
    this.commitTokenState(token);

    const { getRouteInstance } = routerInstance;
    goHome && getRouteInstance && getRouteInstance().push(pageEnum.BASE_HOME);
    return true;
  }

  @Action
  async getUserInfoAction({ userId }: GetUserInfoByUserIdParams) {
    const userInfo = await getUserInfoById({ userId });
    const { roles } = userInfo;
    const roleList: RoleEnum[] = roles.map((item) => item.value);
    //  设置用户信息
    this.commitUserInfoState(userInfo);
    permissionStore.commitRoleState(roleList);
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
    tabStore.commitResetState();
    this.resetState();
    goLogin && getRouteInstance && getRouteInstance().replace(pageEnum.BASE_LOGIN);
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
