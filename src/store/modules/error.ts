import store from '@/store';
import { hotModuleUnregisterModule } from '@/store/util';
import { VuexModule, getModule, Module, Mutation } from 'vuex-module-decorators';

import { formatToDateTime } from '@/utils/momentUtil';
export enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise',
}

export interface ErrorInfo {
  type: ErrorTypeEnum;
  file: string;
  name?: string;
  message: string;
  stack?: string;
  detail: string;
  url: string;
  time?: string;
}
export interface ErrorState {
  errorInfoState: ErrorInfo[] | null;
  errorListCountState: number;
}

const NAME = 'error';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Error extends VuexModule implements ErrorState {
  errorInfoState: ErrorInfo[] = [];
  errorListCountState = 0;

  get getErrorInfoState() {
    return this.errorInfoState;
  }

  get getErrorListCountState() {
    return this.errorListCountState;
  }

  @Mutation
  commitErrorInfoState(info: ErrorInfo): void {
    this.errorInfoState?.unshift({
      ...info,
      time: formatToDateTime(new Date()),
    });
    this.errorListCountState += 1;
  }

  @Mutation
  commitErrorListCountState(count: number): void {
    this.errorListCountState = count;
  }

  // @Action
  // public async setErrorInfoAction(v: ErrorInfo): Promise<void> {
  //   console.log('======================');
  //   console.log(v);
  //   console.log('======================');
  // }
}
export { Error };
export const errorStore = getModule<Error>(Error);
