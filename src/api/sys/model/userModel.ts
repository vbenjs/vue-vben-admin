/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
  code?: string;
}

export interface RoleInfo {
  roleCode: string;
  roleName: string;
  superAdminYn: boolean;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  user: GetUserInfoModel;
  token: string;
  roles: Array<RoleInfo>;
  permissions: Array<string>;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 用户id
  userId: number;
  // 用户名
  username: string;
  fullName: string;
  // 真实名字
  realName: string;
  // 头像
  avatar: string;
  // 介绍
  desc?: string;
  homePath?: string;
}

export interface ChangePasswordParams {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}
