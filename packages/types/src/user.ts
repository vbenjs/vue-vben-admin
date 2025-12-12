import type { BasicUserInfo } from '@vben-core/typings';

/** 用户信息 */
interface UserInfo extends BasicUserInfo {
  // 首页地址
  homePath?: string;
  // 用户角色名称
  roleRemark: string;
}

/** 用户分页查询请求参数 */
interface UserPageRequest {
  asc?: boolean;
  gender?: number;
  limit?: number;
  order?: string;
  page?: number;
  username?: string;
}

/** 用户分页查询响应参数 */
interface UserPageResponse {
  list?: UserInfo[];
  total: number;
}

export type { UserInfo, UserPageRequest, UserPageResponse };
