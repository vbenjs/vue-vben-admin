import type { UserApi } from '../types';

import { requestClient } from '#/apis/request';

/**
 * 登录
 */
export async function login(data: UserApi.LoginParams) {
  return requestClient.post<UserApi.LoginResult>('/auth/login', data);
}

/**
 * 获取用户权限码
 */
export async function getAccessCodes() {
  return requestClient.get<string[]>('/auth/codes');
}
