import type { UserInfo, UserPageRequest, UserPageResponse } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  return requestClient.get<UserInfo>('/sys/user/info');
}

/**
 * 获取用户分页列表
 */
export async function getUserPageApi(
  params: UserPageRequest,
): Promise<UserPageResponse> {
  return requestClient.get<UserPageResponse>('/sys/user/page', { params });
}
