import type { ProjectConfig } from '/#/config';
import type { BeforeMiniState } from '../types';

import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';
import store from '/@/store';

import { PROJ_CFG_KEY } from '/@/enums/cacheEnum';

import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { Persistent } from '/@/utils/cache/persistent';
import { deepMerge } from '/@/utils';

import { resetRouter } from '/@/router';

export interface LockInfo {
  pwd: string | undefined;
  isLock: boolean;
}

let timeId: TimeoutHandle;
const NAME = 'app';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
export default class App extends VuexModule {
  // Page loading status
  private pageLoadingState = false;

  // project config
  private projectConfigState: ProjectConfig | null = Persistent.getLocal(PROJ_CFG_KEY);

  // set main overflow hidden
  private lockMainScrollState = false;

  // When the window shrinks, remember some states, and restore these states when the window is restored
  private beforeMiniState: BeforeMiniState = {};

  get getPageLoading() {
    return this.pageLoadingState;
  }

  get getBeforeMiniState() {
    return this.beforeMiniState;
  }

  get getLockMainScrollState() {
    return this.lockMainScrollState;
  }

  get getProjectConfig(): ProjectConfig {
    return this.projectConfigState || ({} as ProjectConfig);
  }

  @Mutation
  commitPageLoadingState(loading: boolean): void {
    this.pageLoadingState = loading;
  }

  @Mutation
  commitBeforeMiniState(state: BeforeMiniState): void {
    this.beforeMiniState = state;
  }

  @Mutation
  commitLockMainScrollState(lock: boolean): void {
    this.lockMainScrollState = lock;
  }

  @Mutation
  commitProjectConfigState(proCfg: DeepPartial<ProjectConfig>): void {
    this.projectConfigState = deepMerge(this.projectConfigState || {}, proCfg);
    Persistent.setLocal(PROJ_CFG_KEY, this.projectConfigState);
  }

  @Action
  async resumeAllState() {
    resetRouter();
    Persistent.clearAll();
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
}
export const appStore = getModule<App>(App);
