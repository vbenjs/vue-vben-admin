/**
 * 存储驱动接口（策略模式核心抽象）
 * 所有存储实现（localStorage、IndexedDB、Memory 等）都需要实现此接口
 * Driver 层只负责纯粹的 KV 存取，不感知 TTL 和前缀
 */
interface IStorageDriver {
  /** 清除所有存储项 */
  clear(): Promise<void>;

  /** 获取存储项 */
  getItem<T>(key: string): Promise<null | T>;

  /** 获取所有 key */
  keys(): Promise<string[]>;

  /** 移除存储项 */
  removeItem(key: string): Promise<void>;

  /** 设置存储项 */
  setItem<T>(key: string, value: T): Promise<void>;
}

/**
 * 带 TTL 的存储项包装结构
 * TTL 逻辑由 StorageManager 统一管理，Driver 层不感知
 */
interface StorageItem<T> {
  expiry?: number;
  value: T;
}

interface StorageManagerOptions {
  /** 存储驱动实例 */
  driver?: IStorageDriver;
  /** 键前缀，用于命名空间隔离 */
  prefix?: string;
}

export type {IStorageDriver, StorageItem, StorageManagerOptions};
