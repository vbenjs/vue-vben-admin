import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  /**
   * 用户描述
   */
  desc: string;

  /**
   * 当前年度
   */
  fiscalYear?: string;

  /**
   * 首页地址
   */
  homePath: string;

  /**
   * 是否默认账套
   */
  isDefaultTenant?: boolean;

  /**
   * 当前账套ID
   */
  tenantId?: string;

  /**
   * 当前账套名称
   */
  tenantName?: string;

  /**
   * accessToken
   */
  token: string;
}

export type { UserInfo };
