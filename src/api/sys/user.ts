import { defHttp } from '/@/utils/http/axios';

import { ErrorMessageMode } from '/#/axios';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  role: RoleInfo;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  nickname: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

enum Api {
  Login = '/auth/login',
  Logout = '/auth/logout',
  Profile = '/account/profile',
  GetPermCode = '/account/permissions',
  ChangePassword = '/account/change_password',
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
    },
  );
}

export function getPermCode() {
  return defHttp.get<string[]>({ url: Api.GetPermCode });
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

export function doLogout() {
  return defHttp.get({ url: Api.Logout });
}

export function changePasswordApi(params: any) {
  return defHttp.post({ url: Api.ChangePassword, params });
}

export function getUserInfo() {
  return defHttp.get({ url: Api.Profile });
}

export function updateUserInfo(params: any) {
  return defHttp.post({ url: Api.Profile, params });
}
