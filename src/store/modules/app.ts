import type { ProjectConfig } from '/@/types/config';

import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';

import { PROJ_CFG_KEY, LOCK_INFO_KEY } from '/@/enums/cacheEnum';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import {
  setLocal,
  getLocal,
  removeLocal,
  clearSession,
  clearLocal,
} from '/@/utils/helper/persistent';
import { deepMerge } from '/@/utils';

import { resetRouter } from '/@/router';
import { permissionStore } from './permission';
import { tabStore } from './tab';

import { userStore } from './user';

export interface LockInfo {
  pwd: string | undefined;
  isLock: boolean;
}

let timeId: TimeoutHandle;
const NAME = 'app';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class App extends VuexModule {
  // Page loading status
  private pageLoadingState = false;

  // project config
  private projectConfigState: ProjectConfig | null = getLocal(PROJ_CFG_KEY);

  // lock info
  private lockInfoState: LockInfo | null = getLocal(LOCK_INFO_KEY);

  // set main overflow hidden
  private lockMainScrollState = false;

  get getPageLoading() {
    return this.pageLoadingState;
  }

  get getLockMainScrollState() {
    return this.lockMainScrollState;
  }

  get getLockInfo(): LockInfo {
    return this.lockInfoState || ({} as LockInfo);
  }

  get getProjectConfig(): ProjectConfig {
    return this.projectConfigState || ({} as ProjectConfig);
  }

  @Mutation
  commitPageLoadingState(loading: boolean): void {
    this.pageLoadingState = loading;
  }

  @Mutation
  commitLockMainScrollState(lock: boolean): void {
    this.lockMainScrollState = lock;
  }

  @Mutation
  commitProjectConfigState(proCfg: DeepPartial<ProjectConfig>): void {
    this.projectConfigState = deepMerge(this.projectConfigState || {}, proCfg);
    setLocal(PROJ_CFG_KEY, this.projectConfigState);
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
  async resumeAllState() {
    resetRouter();
    clearSession();
    clearLocal();

    permissionStore.commitResetState();
    tabStore.commitResetState();
    userStore.commitResetState();
  }

  @Action
  public async setPageLoadingAction(loading: boolean): Promise<void> {
    if (loading) {
      clearTimeout(timeId);
      // Prevent flicker
      timeId = setTimeout(() => {
        this.commitPageLoadingState(loading);
      }, 50);
    } else {
      this.commitPageLoadingState(loading);
      clearTimeout(timeId);
    }
  }

  /**
   * @description: unlock page
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
export const appStore = getModule<App>(App);
