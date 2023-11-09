/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  grant_type: 'password' | 'refresh_token';
  username?: string;
  password?: string;
  scope?: string;
  refresh_token?: string;
}

export interface RoleInfo {
  roleName: string;
  value: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  code?: number;
  msg?: string;
  // userId: string | number;
  access_token: string;
  // role: RoleInfo;
  token_type: string;
  scope: string;
  expires_in: string;
  refresh_token: string;
}

/**
 * @description: Get user information return value
 */
export interface GetUserInfoModel {
  // 人员id
  ryid: string;
  // 所属法院
  fjm: string;
  // 手机号码
  sjhm: string | number;
  // 用户名
  ryxm: string;
  // 人员类型
  rylx: string;
  // 人员类型名称
  rylxmc: string;
  roles: RoleInfo[];
}
