import type { TimezoneOption } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取系统支持的时区列表
 */
export async function getTimezoneOptionsApi() {
  return requestClient.get<TimezoneOption[]>('/profile/timezone');
}
/**
 * 获取用户时区
 */
export async function getUserTimezoneApi(): Promise<null | string | undefined> {
  return requestClient.get<null | string | undefined>('/user/timezone');
}
/**
 * 设置用户时区
 * @param timezone 时区
 */
export async function setUserTimezoneApi(timezone: string) {
  return requestClient.post('/user/setTimezone', { timezone });
}
