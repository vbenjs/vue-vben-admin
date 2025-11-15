import { setTimezoneHandler } from '@vben/stores';

import { getTimezoneApi, getTimezoneOptionsApi, setTimezoneApi } from '#/api';

/**
 * 初始化时区处理，通过API保存时区设置
 */
export function initTimezone() {
  setTimezoneHandler({
    getTimezone() {
      return getTimezoneApi();
    },
    setTimezone(timezone: string) {
      return setTimezoneApi(timezone);
    },
    getTimezoneOptions() {
      return getTimezoneOptionsApi();
    },
  });
}
