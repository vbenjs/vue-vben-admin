import type {IStorageDriver} from './types';

type StorageType = 'localStorage' | 'sessionStorage';

interface LocalStorageDriverOptions {
  /** 使用 localStorage 还是 sessionStorage */
  storageType?: StorageType;
}

/**
 * LocalStorage / SessionStorage 驱动
 * 用 async 包装同步 API，保持接口统一
 */
class LocalStorageDriver implements IStorageDriver {
  private storage: Storage;

  constructor({
                storageType = 'localStorage',
              }: LocalStorageDriverOptions = {}) {
    if (typeof window === 'undefined') {
      // eslint-disable-next-line unicorn/prefer-type-error -- not a type check, it's an environment check
      throw new Error(
        'LocalStorageDriver is not available in non-browser environments. Use MemoryStorageDriver instead.',
      );
    }
    this.storage =
      storageType === 'localStorage'
        ? window.localStorage
        : window.sessionStorage;
  }

  async clear(): Promise<void> {
    this.storage.clear();
  }

  async getItem<T>(key: string): Promise<null | T> {
    const raw = this.storage.getItem(key);
    if (raw === null) {
      return null;
    }
    try {
      return JSON.parse(raw) as T;
    } catch {
      // 数据损坏，清除并返回 null
      this.storage.removeItem(key);
      return null;
    }
  }

  async keys(): Promise<string[]> {
    const result: string[] = [];
    for (let i = 0; i < this.storage.length; i++) {
      const key = this.storage.key(i);
      if (key !== null) {
        result.push(key);
      }
    }
    return result;
  }

  async removeItem(key: string): Promise<void> {
    this.storage.removeItem(key);
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    this.storage.setItem(key, JSON.stringify(value));
  }
}

export {LocalStorageDriver};
export type {LocalStorageDriverOptions};
