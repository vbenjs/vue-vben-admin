import type { UserInfo } from '@vben-core/typings';

import { request } from '@/services/request';

import type { UserApi } from './typing';

/**
 * 登录
 */
async function userLogin(data: UserApi.LoginParams) {
  return request<UserApi.LoginResult>('/login', { data, method: 'post' });
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  return request<UserInfo>('/getUserInfo', { method: 'get' });
}

export { getUserInfo, userLogin };

export type { UserApi } from './typing';
