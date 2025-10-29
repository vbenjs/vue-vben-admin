import type { TimezoneOption } from '@vben/types';

import { requestClient } from '#/api/request';

/**
 * 获取系统支持的时区列表
 */
export async function getTimezoneOptionsApi() {
  const dataList =
    (await requestClient.get<TimezoneOption[]>(
      '/timezone/getTimezoneOptions',
    )) || [];
  return dataList.map((item) => ({
    label: item.timezone,
    value: item.timezone,
  }));
}
/**
 * 获取用户时区
 */
export async function getTimezoneApi(): Promise<null | string | undefined> {
  return requestClient.get<null | string | undefined>('/timezone/getTimezone');
}
/**
 * 设置用户时区
 * @param timezone 时区
 */
export async function setTimezoneApi(timezone: string) {
  return requestClient.post('/timezone/setTimezone', { timezone });
}
