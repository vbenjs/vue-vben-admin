import type {IStorageDriver} from './types';

/**
 * 内存存储驱动
 * 适用于测试环境和 SSR 场景，数据不持久化
 */
class MemoryStorageDriver implements IStorageDriver {
  private store = new Map<string, unknown>();

  async clear(): Promise<void> {
    this.store.clear();
  }

  async getItem<T>(key: string): Promise<null | T> {
    const value = this.store.get(key);
    return (value as T) ?? null;
  }

  async keys(): Promise<string[]> {
    return [...this.store.keys()];
  }

  async removeItem(key: string): Promise<void> {
    this.store.delete(key);
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.store.set(key, value);
  }
}

export {MemoryStorageDriver};
