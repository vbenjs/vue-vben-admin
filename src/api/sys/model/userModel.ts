import { RoleEnum } from '@/enums/roleEnum';

/**
 * @description: 登陆接口参数
 */
export interface LoginParams {
  username: string;
  password: string;
}

/**
 * @description: 获取用户信息
 */
export interface GetUserInfoByUserIdParams {
  userId: string | number;
}

/**
 * @description: 登录接口返回值
 */
export interface LoginResultModel {
  // 角色值数组
  // roles: { roleName: string; value: RoleEnum }[];
  // 用户id
  userId: string | number;
  // // 用户名
  // username: string;
  // token
  token: string;
  // // 真实名字
  // realName: string;
  // // 介绍
  // desc?: string;
}

/**
 * @description: 获取用户信息返回值
 */
export interface GetUserInfoByUserIdModel {
  roles: { roleName: string; value: RoleEnum }[];
  // 用户id
  userId: string | number;
  // 用户名
  username: string;
  // 真实名字
  realName: string;
  // 介绍
  desc?: string;
}
