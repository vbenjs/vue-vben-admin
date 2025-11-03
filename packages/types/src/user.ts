import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  // 首页地址
  homePath?: string;
  // 用户角色名称
  roleRemark: string;
}

export type { UserInfo };
