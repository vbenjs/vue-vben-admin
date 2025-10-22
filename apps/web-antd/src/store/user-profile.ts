import { ref } from 'vue';

import { getTimezone, setDefaultTimezone } from '@vben/utils';

import { acceptHMRUpdate, defineStore } from 'pinia';

import { getUserTimezoneApi, setUserTimezoneApi } from '#/api';

const useUserProfileStore = defineStore('user-profile', () => {
  const timezoneRef = ref(
    getTimezone() || new Intl.DateTimeFormat().resolvedOptions().timeZone,
  );

  /**
   * 设置用户时区
   * Set the user's timezone
   * @param timezone 时区字符串
   */
  async function setTimezone(timezone: string) {
    // 保存用户的时区设置
    await setUserTimezoneApi(timezone);
    timezoneRef.value = timezone;
    // 设置dayjs默认时区
    setDefaultTimezone(timezone);
  }

  /**
   * 初始化用户时区
   * Initialize the user's timezone
   */
  async function initTimezone() {
    // 从服务器获取用户时区
    const timezone = await getUserTimezoneApi();
    if (timezone) {
      timezoneRef.value = timezone;
      // 设置dayjs默认时区
      setDefaultTimezone(timezone);
    }
  }

  initTimezone();

  return {
    timezone: timezoneRef,
    setTimezone,
    initTimezone,
  };
});

export { useUserProfileStore };

// 解决热更新问题
const hot = import.meta.hot;
if (hot) {
  hot.accept(acceptHMRUpdate(useUserProfileStore, hot));
}
