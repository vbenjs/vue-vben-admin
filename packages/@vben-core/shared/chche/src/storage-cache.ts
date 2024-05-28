import type { IStorageCache, StorageType, StorageValue } from './types';

class StorageCache implements IStorageCache {
  protected prefix: string;
  protected storage: Storage;

  constructor(prefix: string = '', storageType: StorageType = 'localStorage') {
    this.prefix = prefix;
    this.storage =
      storageType === 'localStorage' ? localStorage : sessionStorage;
  }

  // 获取带前缀的键名
  private getFullKey(key: string): string {
    return this.prefix + key;
  }

  // 获取项之后的钩子方法
  protected afterGetItem<T>(_key: string, _value: T | null): void {}

  // 设置项之后的钩子方法
  protected afterSetItem<T>(
    _key: string,
    _value: T,
    _expiryInMinutes?: number,
  ): void {}

  // 获取项之前的钩子方法
  protected beforeGetItem(_key: string): void {}

  // 设置项之前的钩子方法
  protected beforeSetItem<T>(
    _key: string,
    _value: T,
    _expiryInMinutes?: number,
  ): void {}

  /**
   * 清空存储
   */
  clear(): void {
    try {
      this.storage.clear();
    } catch (error) {
      console.error('Error clearing storage', error);
    }
  }

  /**
   * 获取存储项
   * @param key 存储键
   * @returns 存储值或 null
   */
  getItem<T>(key: string): T | null {
    const fullKey = this.getFullKey(key);
    this.beforeGetItem(fullKey);

    let value: T | null = null;
    try {
      const item = this.storage.getItem(fullKey);
      if (item) {
        const storageValue: StorageValue<T> = JSON.parse(item);
        if (storageValue.expiry && storageValue.expiry < Date.now()) {
          this.storage.removeItem(fullKey);
        } else {
          value = storageValue.data;
        }
      }
    } catch (error) {
      console.error('Error getting item from storage', error);
    }

    this.afterGetItem(fullKey, value);
    return value;
  }

  /**
   * 获取存储中的键
   * @param index 键的索引
   * @returns 存储键或 null
   */
  key(index: number): null | string {
    try {
      return this.storage.key(index);
    } catch (error) {
      console.error('Error getting key from storage', error);
      return null;
    }
  }

  /**
   * 获取存储项的数量
   * @returns 存储项的数量
   */
  length(): number {
    try {
      return this.storage.length;
    } catch (error) {
      console.error('Error getting storage length', error);
      return 0;
    }
  }

  /**
   * 删除存储项
   * @param key 存储键
   */
  removeItem(key: string): void {
    const fullKey = this.getFullKey(key);
    try {
      this.storage.removeItem(fullKey);
    } catch (error) {
      console.error('Error removing item from storage', error);
    }
  }

  /**
   * 设置存储项
   * @param key 存储键
   * @param value 存储值
   * @param expiryInMinutes 过期时间（分钟）
   */
  setItem<T>(key: string, value: T, expiryInMinutes?: number): void {
    const fullKey = this.getFullKey(key);
    this.beforeSetItem(fullKey, value, expiryInMinutes);

    const now = Date.now();
    const expiry = expiryInMinutes ? now + expiryInMinutes * 60_000 : null;

    const storageValue: StorageValue<T> = {
      data: value,
      expiry,
    };

    try {
      this.storage.setItem(fullKey, JSON.stringify(storageValue));
    } catch (error) {
      console.error('Error setting item in storage', error);
    }

    this.afterSetItem(fullKey, value, expiryInMinutes);
  }
}

export { StorageCache };
