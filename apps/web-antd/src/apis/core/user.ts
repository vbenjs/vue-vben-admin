import type { UserInfo } from '@vben/types';

import { requestClient } from '#/forward';

/**
 * 获取用户信息
 */
export async function getUserInfo() {
  return requestClient.get<UserInfo>('/user/info');
}
