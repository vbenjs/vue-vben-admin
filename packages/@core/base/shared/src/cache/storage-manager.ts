import type {
  IStorageDriver,
  StorageItem,
  StorageManagerOptions,
} from './types';

import {LocalStorageDriver} from './local-storage-driver';
import {MemoryStorageDriver} from './memory-storage-driver';

/**
 * 存储管理器（策略模式）
 * - prefix（命名空间隔离）在此层处理
 * - TTL（过期机制）在此层处理
 * - Driver 只负责纯粹的 KV 存取
 */
class StorageManager {
  private driver: IStorageDriver;
  private prefix: string;

  constructor({driver, prefix = ''}: StorageManagerOptions = {}) {
    this.driver = driver || this.createDefaultDriver();
    this.prefix = prefix;
    if (!this.prefix && this.driver instanceof LocalStorageDriver) {
      console.warn(
        '[StorageManager] empty prefix combined with LocalStorageDriver — clear()/keys() will affect every localStorage entry.',
      );
    }
  }

  /**
   * 清除所有带前缀的存储项
   */
  async clear(): Promise<void> {
    const allKeys = await this.driver.keys();
    const fullPrefix = this.prefix ? `${this.prefix}-` : '';
    const prefixedKeys = allKeys.filter((key) => key.startsWith(fullPrefix));
    await Promise.all(prefixedKeys.map((key) => this.driver.removeItem(key)));
  }

  /**
   * 清除所有过期的存储项
   */
  async clearExpiredItems(): Promise<void> {
    const allKeys = await this.driver.keys();
    const fullPrefix = this.prefix ? `${this.prefix}-` : '';
    const prefixedKeys = allKeys.filter((key) => key.startsWith(fullPrefix));

    for (const fullKey of prefixedKeys) {
      const raw = await this.driver.getItem<StorageItem<unknown>>(fullKey);
      if (raw && raw.expiry && Date.now() > raw.expiry) {
        await this.driver.removeItem(fullKey);
      }
    }
  }

  /**
   * 获取存储项
   * @param key 键
   * @param defaultValue 当项不存在或已过期时返回的默认值
   * @returns 值，如果项已过期则返回默认值
   */
  async getItem<T>(
    key: string,
    defaultValue: null | T = null,
  ): Promise<null | T> {
    const fullKey = this.getFullKey(key);
    const raw = await this.driver.getItem<StorageItem<T>>(fullKey);

    if (!raw) {
      return defaultValue;
    }

    // TTL 检查
    if (raw.expiry && Date.now() > raw.expiry) {
      await this.driver.removeItem(fullKey);
      return defaultValue;
    }

    return raw.value;
  }

  /**
   * 获取当前前缀下的所有存储键（已去除前缀部分）
   */
  async keys(): Promise<string[]> {
    const allKeys = await this.driver.keys();
    const fullPrefix = this.prefix ? `${this.prefix}-` : '';
    if (!fullPrefix) return allKeys;
    return allKeys
      .filter((key) => key.startsWith(fullPrefix))
      .map((key) => key.slice(fullPrefix.length));
  }

  /**
   * 移除存储项
   * @param key 键
   */
  async removeItem(key: string): Promise<void> {
    const fullKey = this.getFullKey(key);
    await this.driver.removeItem(fullKey);
  }

  /**
   * 设置存储项
   * @param key 键
   * @param value 值
   * @param ttl 存活时间（毫秒）
   */
  async setItem<T>(key: string, value: T, ttl?: number): Promise<void> {
    const fullKey = this.getFullKey(key);
    const expiry = ttl ? Date.now() + ttl : undefined;
    const item: StorageItem<T> = { expiry, value };
    await this.driver.setItem(fullKey, item);
  }

  /**
   * 根据运行环境创建默认驱动：
   * - 浏览器环境（window.localStorage 可用）→ LocalStorageDriver
   * - SSR / Node 环境 → MemoryStorageDriver
   */
  private createDefaultDriver(): IStorageDriver {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return new LocalStorageDriver();
      }
    } catch (error) {
      // localStorage access denied (e.g. Safari private mode)
      console.warn(
        'localStorage is not accessible, falling back to MemoryStorageDriver:',
        error,
      );
    }
    return new MemoryStorageDriver();
  }

  /**
   * 获取完整的存储键（带前缀）
   * @param key 原始键
   * @returns 带前缀的完整键
   */
  private getFullKey(key: string): string {
    return this.prefix ? `${this.prefix}-${key}` : key;
  }
}

export { StorageManager };
