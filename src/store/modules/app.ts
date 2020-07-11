import store from '@/store';
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';

import { PROJ_CFG_KEY, LOCK_INFO_KEY } from '@/enums/cacheEnum';
import { ProjectConfig } from '@/types/config';

import { userStore } from './user';
import { setLocal, getLocal, removeLocal } from '@/store/persistent';

export interface LockInfo {
  pwd: string | undefined;
  isLock: boolean;
}
export interface AppState {
  // 系统菜单
  pageLoadingState: boolean;
  projCfgState: ProjectConfig | null;
  lockInfoState: LockInfo | null;
}

let timeId: ReturnType<typeof setTimeout>;
@Module({ dynamic: true, namespaced: true, store, name: 'app' })
class App extends VuexModule implements AppState {
  pageLoadingState = false;

  projCfgState: ProjectConfig | null = getLocal(PROJ_CFG_KEY);

  lockInfoState: LockInfo | null = getLocal(LOCK_INFO_KEY);

  get getPageLoading() {
    return this.pageLoadingState;
  }

  get getLockInfo(): LockInfo {
    return this.lockInfoState || ({} as LockInfo);
  }

  get getProjCfg(): ProjectConfig {
    return this.projCfgState || ({} as ProjectConfig);
  }

  @Mutation
  commitPageLoadingState(loading: boolean): void {
    this.pageLoadingState = loading;
  }

  @Mutation
  commitProjCfgState(proCfg: Partial<ProjectConfig>): void {
    this.projCfgState = Object.assign({}, this.projCfgState, proCfg);
    setLocal(PROJ_CFG_KEY, this.projCfgState);
  }

  @Mutation
  commitLockInfoState(info: LockInfo): void {
    this.lockInfoState = Object.assign({}, this.lockInfoState, info);
    setLocal(LOCK_INFO_KEY, this.lockInfoState);
  }

  @Mutation
  resetLockInfo(): void {
    removeLocal(LOCK_INFO_KEY);
    this.lockInfoState = null;
  }

  @Action
  public async setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // 防止闪动
      timeId = setTimeout(() => {
        this.commitPageLoadingState(loading);
      }, 100);
    } else {
      this.commitPageLoadingState(loading);
      clearTimeout(timeId);
    }
  }

  /**
   * @description: 解锁
   */
  @Action
  public async unLockAction({ password, valid = true }: { password: string; valid?: boolean }) {
    if (!valid) {
      this.resetLockInfo();
      return true;
    }
    const tryLogin = async () => {
      try {
        const username = userStore.getUserInfoState.username;
        const res = await userStore.login({ username, password }, false);
        if (res) {
          this.resetLockInfo();
        }
        return res;
      } catch (error) {
        return false;
      }
    };

    if (this.getLockInfo) {
      if (this.getLockInfo.pwd === password) {
        this.resetLockInfo();
        return true;
      }
      const res = await tryLogin();
      return res;
    }
    const res = await tryLogin();
    return res;
  }
}
export { App };
export const appStore = getModule<App>(App);
