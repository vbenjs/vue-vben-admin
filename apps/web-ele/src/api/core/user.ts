import type { UserInfo, UserPageRequest, UserPageResponse } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  return requestClient.get<UserInfo>('/sys/user/info');
}

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(
  params: UserPageRequest,
): Promise<UserPageResponse> {
  return requestClient.post<UserPageResponse>('/sys/user/page', params);
}

export async function createUserApi(data: {
  avatar?: string;
  password: string;
  roleIdList: number[];
  username: string;
}) {
  return requestClient.post('/sys/user', data);
}

export async function updateUserApi(data: {
  avatar?: string;
  id: number;
  password?: string;
  roleIdList: number[];
  username: string;
}) {
  return requestClient.put('/sys/user', data);
}

export interface UserDetail {
  id: number;
  username: string;
  avatar: null | string;
  roleIdList: number[];
}

export async function getUserDetailApi(id: number) {
  return requestClient.get(`/sys/user/${id}`);
}

/**
 * 获取角色列表
 */
export async function getRoleListApi() {
  return requestClient.get('/sys/role/list');
}
