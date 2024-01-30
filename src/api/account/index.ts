import { defHttp } from '@/utils/http/axios';
import { LoginParams, LoginResultModel, GetUserInfoModel } from './model/accountModel';

import { ErrorMessageMode } from '#/axios';

enum Api {
  Login = '/auth/login',
  Logout = '/logout',
  GetUserInfo = '/account/info',
  GetPermCode = '/account/permCode',
  TestRetry = '/testRetry',
}

/**
 * @description: user login api
 */
export function loginApi(params: LoginParams, mode: ErrorMessageMode = 'modal') {
  return defHttp.post<LoginResultModel>(
    {
      url: Api.Login,
      params,
    },
    {
      errorMessageMode: mode,
      isTransformResponse: false,
    },
  );
}

/**
 * @description: getUserInfo
 */
export function getUserInfo() {
  return defHttp.get<GetUserInfoModel>(
    { url: Api.GetUserInfo },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>(
    { url: Api.GetPermCode },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
}

export function getPermCodeByRole(roleId: string) {
  return defHttp.get<string[]>(
    { url: `${Api.GetPermCode}/${roleId}` },
    { errorMessageMode: 'none', isTransformResponse: false },
  );
}

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function testRetry() {
  return defHttp.get(
    { url: Api.TestRetry },
    {
      retryRequest: {
        isOpenRetry: true,
        count: 5,
        waitTime: 1000,
      },
    },
  );
}
