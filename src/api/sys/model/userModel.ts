import { UserInfo } from '/#/store';

/**
 * @description: Login interface parameters
 */
export interface LoginParams {
  username: string;
  password: string;
}

export interface RoleInfo {
  id: number;
  name: string;
  description: string;
  guard_name: string;
  updated_at: string;
  created_at: string;
}

/**
 * @description: Login interface return value
 */
export interface LoginResultModel {
  access_token: string;
  expires_in: number;
  token_type: string;
  userinfo: UserInfo;
}

/**
 * @description: Get user information return value
 */
export type GetUserInfoModel = UserInfo;
