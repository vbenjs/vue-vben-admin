import type { UserInfo } from '@vben/types';

import type { UserApiType } from '../types';

import { requestClient } from '#/forward';

/**
 * 登录
 */
async function userLogin(data: UserApiType.LoginParams) {
  return requestClient.post<UserApiType.LoginResult>('/auth/login', data);
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  return requestClient.get<UserInfo>('/auth/getUserInfo');
}

export { getUserInfo, userLogin };

export * from './user';
