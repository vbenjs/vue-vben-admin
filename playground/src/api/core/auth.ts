import { baseRequestClient, requestClient } from '#/api/request';
import { useAccessStore } from '@vben/stores';

import { formatToken } from '#/utils/token-util';

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
  }

  export interface RefreshTokenResult {
    data: string;
    status: number;
  }
}

/**
 * 登录
 */
export async function loginApi(data: AuthApi.LoginParams) {
  return requestClient.post<AuthApi.LoginResult>('/auth/login', data, {
    withCredentials: true,
  });
}

/**
 * 刷新accessToken
 */
export async function refreshTokenApi() {
  const accessStore = useAccessStore();
  return await baseRequestClient.post<AuthApi.RefreshTokenResult>(
    '/auth/refresh',
    null,
    {
      withCredentials: true,
      headers: {
        Authorization: formatToken(accessStore.refreshToken),
      },
    },
  );
}

/**
 * 退出登录
 */
export async function logoutApi() {
  const accessStore = useAccessStore();
  return await baseRequestClient.post<string[]>('/auth/logout', null, {
    withCredentials: true,
    headers: {
      Authorization: formatToken(accessStore.accessToken),
    },
  });
}

/**
 * 获取用户权限码
 */
export async function getAccessCodesApi() {
  return requestClient.get<string[]>('/auth/codes');
}
