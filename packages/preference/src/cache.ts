import type { Preference } from '@vben-core/typings';

class PreferenceCache {
  cachePrefix: string;
  constructor(cachePrefix: string) {
    this.cachePrefix = cachePrefix;
  }

  /**
   * 从 localStorage 中获取偏好设置
   * @returns  返回从 localStorage 中获取的偏好设置，如果没有获取到，则返回默认偏好设置。
   */
  get(defaultValue: Preference): Preference {
    let cache = defaultValue;
    try {
      cache = JSON.parse(localStorage.getItem(this.getCacheKey()) || '');
    } catch {
      return defaultValue;
    }
    return cache;
  }

  /**
   * 获取偏好设置的缓存键
   */
  getCacheKey(name: string = 'preference') {
    return `__${this.cachePrefix}-${name}__`;
  }

  /**
   * 从 localStorage 中移除偏好设置
   */
  remove() {
    localStorage.removeItem(this.getCacheKey());
    localStorage.removeItem(this.getCacheKey('locale'));
    localStorage.removeItem(this.getCacheKey('theme'));
  }

  /**
   * 将当前偏好设置持久化到 localStorage
   */
  set(preference: Preference) {
    localStorage.setItem(this.getCacheKey(), JSON.stringify(preference));
    // 额外存储一份主题、语言
    localStorage.setItem(this.getCacheKey('locale'), preference.locale);
    localStorage.setItem(this.getCacheKey('theme'), preference.theme);
  }

  /**
   * 设置偏好设置的缓存前缀
   * @param prefix - 前缀
   */
  setCachePrefix(prefix: string) {
    this.cachePrefix = prefix;
  }
}

export type PreferenceCacheType = PreferenceCache;
export { PreferenceCache };
