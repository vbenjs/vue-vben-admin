import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

export namespace UserApi {
  /** 用户列表查询参数 */
  export interface UserListParams {
    pageNum?: number;
    pageSize?: number;
    userName?: string;
  }

  /** 用户信息 */
  export interface UserInfo {
    userId: number;
    userName: string;
    displayName: string;
    email?: string;
    phone?: string;
    gender?: 'F' | 'M' | 'S';
    status: '0' | '8' | '9';
    statusName: string;
    departmentCodes: string[];
    createdTime: string;
    updatedTime: string;
  }

  /** 分页结果 */
  export interface PageResult<T> {
    list: T[];
    total: number;
    pageNum: number;
    pageSize: number;
    pages: number;
  }

  /** 用户列表响应 */
  export interface UserListResult {
    userId: number;
    userName: string;
    displayName: string;
    email?: string;
    phone?: string;
    gender?: 'F' | 'M' | 'S';
    status: '0' | '8' | '9';
    statusName: string;
    departmentCodes: string[];
    createdTime: string;
    updatedTime: string;
  }

  /** 用户详情参数 */
  export interface UserDetailParams {
    userId: number;
  }

  /** 用户详情 */
  export interface UserDetail {
    userId: number;
    userName: string;
    displayName: string;
    email?: string;
    phone?: string;
    gender?: 'F' | 'M' | 'S';
    birth?: string;
    address?: string;
    info?: string;
    status: '0' | '8' | '9';
    departmentCodes: string[];
    createdTime: string;
    updatedTime: string;
  }

  /** 创建用户参数 */
  export interface CreateUserParams {
    userName: string;
    displayName: string;
    email?: string;
    phone?: string;
    departmentCodes: string[];
  }

  /** 更新用户参数 */
  export interface UpdateUserParams {
    userId: number;
    displayName?: string;
    email?: string;
    phone?: string;
    departmentCodes: string[];
  }

  /** 删除用户参数 */
  export interface DeleteUserParams {
    userId: number;
  }

  /** 更新用户状态参数 */
  export interface UpdateUserStatusParams {
    userId: number;
    status: '0' | '8' | '9';
  }

  /** 获取用户角色参数 */
  export interface UserRolesRequest {
    userId?: number;
    userName?: string;
  }

  /** 用户角色信息 */
  export interface UserRoleInfo {
    roleId: number;
    roleCode: string;
    roleName: string;
    roleDesc: string;
    roleStatus: string;
    isSystem: string;
    createdTime: string;
    updatedTime: string;
  }

  /** 用户角色响应 */
  export interface UserRolesResponse {
    userId: number;
    userName: string;
    roles: UserRoleInfo[];
  }

  /** 分配用户角色参数 */
  export interface AssignUserRolesRequest {
    userId: number;
    roleCodes: string[];
  }

  /** 通用响应 */
  export interface CommonResult {
    code: string;
    message: string;
    data?: any;
  }
}

/**
 * 获取用户信息
 */
export async function getUserInfoApi() {
  return requestClient.get<UserInfo>('/auth/user/userinfo');
}

/**
 * 获取用户列表
 */
export async function getUserListApi(params: UserApi.UserListParams) {
  return requestClient.get<UserApi.PageResult<UserApi.UserListResult>>(
    '/auth/user/list',
    {
      params,
    },
  );
}

/**
 * 获取用户详情
 */
export async function getUserDetailApi(params: UserApi.UserDetailParams) {
  return requestClient.get<UserApi.UserDetail>('/auth/user/detail', {
    params,
  });
}

/**
 * 创建用户
 */
export async function createUserApi(data: UserApi.CreateUserParams) {
  return requestClient.post<UserApi.CommonResult>('/auth/user/create', data);
}

/**
 * 更新用户
 */
export async function updateUserApi(data: UserApi.UpdateUserParams) {
  return requestClient.put<UserApi.CommonResult>('/auth/user/update', data);
}

/**
 * 删除用户
 */
export async function deleteUserApi(data: UserApi.DeleteUserParams) {
  return requestClient.delete<UserApi.CommonResult>('/auth/user/delete', {
    data,
  });
}

/**
 * 更新用户状态
 */
export async function updateUserStatusApi(
  data: UserApi.UpdateUserStatusParams,
) {
  return requestClient.put<UserApi.CommonResult>(
    '/auth/user/update-status',
    data,
  );
}

/**
 * 获取用户角色
 */
export async function getUserRolesApi(params: UserApi.UserRolesRequest) {
  return requestClient.get<UserApi.UserRolesResponse>('/auth/user/roles', {
    params,
  });
}

/**
 * 为用户分配角色
 */
export async function assignUserRolesApi(data: UserApi.AssignUserRolesRequest) {
  return requestClient.put<UserApi.CommonResult>(
    '/auth/user/assign-roles',
    data,
  );
}
