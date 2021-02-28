import store from '/@/store';
import { hotModuleUnregisterModule } from '/@/utils/helper/vuexHelper';
import { VuexModule, getModule, Module, Mutation, Action } from 'vuex-module-decorators';

import { formatToDateTime } from '/@/utils/dateUtil';
import { ErrorTypeEnum } from '/@/enums/exceptionEnum';
import projectSetting from '/@/settings/projectSetting';

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

const NAME = 'app-error';
hotModuleUnregisterModule(NAME);
@Module({ dynamic: true, namespaced: true, store, name: NAME })
class Error extends VuexModule implements ErrorState {
  // error log list
  errorInfoState: ErrorInfo[] = [];

  // error log count
  errorListCountState = 0;

  get getErrorInfoState() {
    return this.errorInfoState;
  }

  get getErrorListCountState() {
    return this.errorListCountState;
  }

  @Mutation
  commitErrorInfoState(info: ErrorInfo): void {
    const item = {
      ...info,
      time: formatToDateTime(new Date()),
    };
    this.errorInfoState = [item, ...this.errorInfoState];
    this.errorListCountState += 1;
  }

  @Mutation
  commitErrorListCountState(count: number): void {
    this.errorListCountState = count;
  }

  @Action
  setupErrorHandle(error: any) {
    const { useErrorHandle } = projectSetting;
    if (!useErrorHandle) return;

    const errInfo: Partial<ErrorInfo> = {
      message: error.message,
      type: ErrorTypeEnum.AJAX,
    };
    if (error.response) {
      const {
        config: { url = '', data: params = '', method = 'get', headers = {} } = {},
        data = {},
      } = error.response;
      errInfo.url = url;
      errInfo.name = 'Ajax Error!';
      errInfo.file = '-';
      errInfo.stack = JSON.stringify(data);
      errInfo.detail = JSON.stringify({ params, method, headers });
    }
    this.commitErrorInfoState(errInfo as ErrorInfo);
  }
}
export const errorStore = getModule<Error>(Error);
