import type { UserInfo } from '@vben/types';

import type { UserApiType } from '../types';

import { get, post } from '#/forward';

/**
 * 登录
 */
async function userLogin(data: UserApiType.LoginParams) {
  return post<UserApiType.LoginResult>('/login', data);
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  return get<UserInfo>('/getUserInfo');
}

export { getUserInfo, userLogin };

export * from './user';
