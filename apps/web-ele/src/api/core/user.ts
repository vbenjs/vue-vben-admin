import type { UserInfo } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取用户信息
 */
export async function getUserInfoApi(): Promise<UserInfo> {
  return requestClient.get<UserInfo>('/sys/user/info');
}
