import { defHttp } from '@/utils/http/axios';
import {
  LoginParams,
  LoginRecordResult,
  LoginResultModel,
  QueryLoginRecordForm,
} from '../../ApiModel/system/userModel';

import { ErrorMessageMode } from '/#/axios';
import { ContentTypeEnum } from '@/enums/httpEnum';
import { TOKEN_KEY } from '@/enums/cacheEnum';

enum Api {
  Login = '/login',
  verifyCode = '/verifyCode',
  modifyPassword = '/admin/sysAccount/modifyPassword',
  loginRecord = '/admin/sysAccountLoginRecord',
  Logout = '/logout',
  // TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'none') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
      headers: { 'Content-Type': ContentTypeEnum.FORM_URLENCODED },
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}
export async function getVerifyCode() {
  const res = await defHttp.get(
    {
      url: Api.verifyCode,
      responseType: 'blob',
      // params: '',
      headers: {
        'Access-Control-Expose-Headers': TOKEN_KEY,
      },
    },
    {
      isReturnNativeResponse: true,
    },
  );
  return res;
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function modifyPassword(parameter: {}) {
  return defHttp.post<null>({
    url: Api.modifyPassword,
    data: parameter,
  });
}

export function loginRecord(data: QueryLoginRecordForm) {
  return defHttp.post<LoginRecordResult>(
    {
      url: Api.loginRecord,
      data,
    },
    { isTable: true },
  );
}
