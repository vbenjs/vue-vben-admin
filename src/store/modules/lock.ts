import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';

import { LOCK_INFO_KEY } from '/@/enums/cacheEnum';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { setLocal, getLocal, removeLocal } from '/@/utils/cache/persistent';

import { userStore } from './user';

export interface LockInfo {
  pwd: string | undefined;
  isLock: boolean;
}

const NAME = 'lock';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Lock extends VuexModule {
  // lock info
  private lockInfoState: LockInfo | null = getLocal(LOCK_INFO_KEY);

  get getLockInfo(): LockInfo {
    return this.lockInfoState || ({} as LockInfo);
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

  /**
   * @description: unlock page
   */
  @Action
  public async unLockAction({ password }: { password: string }) {
    const tryLogin = async () => {
      try {
        const username = userStore.getUserInfoState.username;
        const res = await userStore.login({ username, password, goHome: false, mode: 'none' });
        if (res) {
          this.resetLockInfo();
        }
        return res;
      } catch (error) {
        return false;
      }
    };

    if (this.getLockInfo?.pwd === password) {
      this.resetLockInfo();
      return true;
    }
    return await tryLogin();
  }
}
export const lockStore = getModule<Lock>(Lock);
