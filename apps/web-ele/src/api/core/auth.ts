import { baseRequestClient, requestClient } from '#/api/request';

export namespace AuthApi {
  /** 登录接口参数 */
  export interface LoginParams {
    password?: string;
    username?: string;
  }

  /** 登录接口返回值 */
  export interface LoginResult {
    accessToken: string;
    refreshToken: string;
    accessTokenExpire: string;
    refreshTokenExpire: string;
  }

  export interface RefreshTokenResult {
    accessToken: string;
    accessTokenExpire: string;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/sys/auth/login', data);
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  return baseRequestClient.post<AuthApi.RefreshTokenResult>('/auth/refresh');
}

/**
 * 退出登录
 */
export async function logoutApi() {
  return baseRequestClient.post('sys/auth/logout');
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return [];
}
