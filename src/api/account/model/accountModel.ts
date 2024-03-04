import { BasicPageParams } from '@/api/model/baseModel';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  userId: string | number;
  token: string;
  roles: RoleInfo[];
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  roles: RoleInfo[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
}

export interface RoleModel {
  id: string;
  perm: string;
  name: string;
}

export interface AccountListParams extends BasicPageParams {
  q: string;
}

export interface AccountModel {
  id: string;
  roleId: string;
  role?: RoleModel;
  deptId: string;
  username: string;
  password?: string;
  name: string;
  phone: string;
  status: string;
  remark: string;
}
