import type { UserInfo } from '@vben/types';

import { client } from '#/api/request';

/**
 * 获取用户信息
 */
// export async function getUserInfoApi() {
//   return requestClient.get<UserInfo>('/user/info');
// }
export async function getUserInfoApi() {
  return client.get<UserInfo>('/user/info');
}
