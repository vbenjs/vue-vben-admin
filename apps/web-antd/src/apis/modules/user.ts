import type { UserInfo } from '@vben/types';

import type { UserApi } from '../types';

import { requestClient } from '#/forward';

/**
 * 登录
 */
async function userLogin(data: UserApi.LoginParams) {
  return requestClient.post<UserApi.LoginResult>('/auth/login', data);
}

/**
 * 获取用户信息
 */
async function getUserInfo() {
  return requestClient.get<UserInfo>('/auth/getUserInfo');
}

/**
 * 获取用户权限码
 */
async function getAccessCodes() {
  return requestClient.get<string[]>('/auth/getAccessCodes');
}

export { getAccessCodes, getUserInfo, userLogin };
