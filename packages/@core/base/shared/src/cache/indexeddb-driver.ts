import type {IStorageDriver} from './types';

interface IndexedDBDriverOptions {
  /** 数据库名称 */
  dbName?: string;
  /** 数据库版本 */
  dbVersion?: number;
  /** 对象存储名称 */
  storeName?: string;
}

/**
 * IndexedDB 驱动
 * 采用懒初始化模式，首次操作时自动打开数据库
 */
class IndexedDBDriver implements IStorageDriver {
  private dbName: string;
  private dbPromise: null | Promise<IDBDatabase> = null;
  private dbVersion: number;
  private storeName: string;

  constructor({
                dbName = 'vben-storage',
                dbVersion = 1,
                storeName = 'kv-store',
              }: IndexedDBDriverOptions = {}) {
    this.dbName = dbName;
    this.dbVersion = dbVersion;
    this.storeName = storeName;
  }

  async clear(): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.clear();

      request.addEventListener('success', () => resolve());
      request.addEventListener('error', () => reject(request.error));
    });
  }

  async getItem<T>(key: string): Promise<null | T> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.get(key);

      request.addEventListener('success', () =>
        resolve(request.result ?? null),
      );
      request.addEventListener('error', () => reject(request.error));
    });
  }

  async keys(): Promise<string[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAllKeys();

      request.addEventListener('success', () =>
        resolve(request.result.map(String)),
      );
      request.addEventListener('error', () => reject(request.error));
    });
  }

  async removeItem(key: string): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.delete(key);

      request.addEventListener('success', () => resolve());
      request.addEventListener('error', () => reject(request.error));
    });
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.put(value, key);

      request.addEventListener('success', () => resolve());
      request.addEventListener('error', () => reject(request.error));
    });
  }

  /**
   * 懒初始化：首次调用时打开数据库，后续复用同一个 Promise
   */
  private getDB(): Promise<IDBDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = this.openDB();
    }
    return this.dbPromise;
  }

  private openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.addEventListener('upgradeneeded', () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      });

      request.addEventListener('success', () => resolve(request.result));
      request.addEventListener('error', () => reject(request.error));
    });
  }
}

export {IndexedDBDriver};
export type {IndexedDBDriverOptions};
