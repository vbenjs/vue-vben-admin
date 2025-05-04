import type { Api } from '#/api/basicParams';

import { requestClient } from '#/api/request';

export namespace UserApi {
  export interface UserAllItem {
    id: number;
    name: string;
    status: 0 | 1;
  }
  export interface UserItem {
    id: number;
    username: string;
    realName: string;
    age: number;
    gender: number;
    phone: string;
    email: string;
    address: string;
    status: number;
    avatar: string;
    createdAt: string;
    updatedAt: string;
  }
}
/**
 * 获取用户简单列表
 */
export async function getUserAllApi() {
  return requestClient.get<UserApi.UserItem[]>('/user/all');
}
/**
 * 获取用户列表
 */
export async function getUserListApi(params: Api.BasicParams) {
  return requestClient.get<UserApi.UserItem[]>('/user/list', { params });
}

/**
 * 获取用户详情
 */
export async function getUserByIdApi(id: number | string) {
  return requestClient.get<UserApi.UserItem>(`/user/${id}`);
}

/**
 * 创建用户
 */
export async function createUserApi(data: UserApi.UserItem) {
  return requestClient.post<{ id: number }>('/user', data);
}

/**
 * 更新用户
 */
export async function updateUserApi({ id, ...data }) {
  return requestClient.put<{ affected: number }>(`/user/${id}`, data);
}

/**
 * 删除用户
 */

export async function deleteUserApi(id: number | string) {
  return requestClient.delete<{ affected: number }>(`/user/${id}`);
}
