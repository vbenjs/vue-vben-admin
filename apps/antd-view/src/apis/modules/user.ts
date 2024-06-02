import type { UserApiType } from '@/apis/types';
import type { UserInfo } from '@vben/types';

import { request } from '@/forward/request';

/**
 * 登录
 */
async function userLogin(data: UserApiType.LoginParams) {
  return request<UserApiType.LoginResult>('/login', { data, method: 'post' });
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  return request<UserInfo>('/getUserInfo', { method: 'get' });
}

export { getUserInfo, userLogin };

export * from './user';
