---
outline: deep
---

# 缓存

::: tip 前言

基于**策略模式**的异步存储管理方案，支持多种存储后端（localStorage、IndexedDB、Memory），提供统一 API。所有方法均为异步，便于在 Driver 间无缝切换。

:::

::: tip

`@vben/utils` 已重新导出缓存模块的全部能力，业务侧统一从 `@vben/utils` 引入即可。

:::

## 架构设计

```shell
┌───────────────────────────────────────────────┐
│             StorageManager                    │
│  ┌─────────────┐  ┌───────────────────────┐    │
│  │ Prefix 隔离 │  │   TTL 过期管理        │    │
│  └─────────────┘  └───────────────────────┘    │
├───────────────────────────────────────────────┤
│             IStorageDriver                    │
├──────────┬─────────────────┬──────────────────┤
│  Local   │   IndexedDB     │     Memory       │
│  Storage │   Driver        │     Driver        │
│  Driver  │                 │                  │
└──────────┴─────────────────┴──────────────────┘
```

**分层职责：**

| 层级             | 职责                                         |
| ---------------- | -------------------------------------------- |
| `StorageManager` | 命名空间前缀隔离、TTL 过期检查、统一对外 API |
| `IStorageDriver` | 纯粹的 KV 存取抽象接口                       |
| 各 Driver 实现   | 对接具体存储引擎，不感知前缀和 TTL           |

## 快速开始

### 基本使用

不传 `driver` 时，浏览器在 `localStorage` 可用时使用 `LocalStorageDriver`，否则回退到 `MemoryStorageDriver`（如 Safari 隐私模式）；SSR/Node 使用 `MemoryStorageDriver`：

```ts
import { StorageManager } from '@vben/utils';

const cache = new StorageManager({ prefix: 'myapp' });

// 存储数据
await cache.setItem('user', { name: '张三', age: 28 });

// 读取数据
const user = await cache.getItem('user');
// => { name: '张三', age: 28 }

// 带默认值读取
const settings = await cache.getItem('settings', { theme: 'light' });
// 如果不存在，返回 { theme: 'light' }

// 删除数据
await cache.removeItem('user');

// 清除当前前缀下所有数据
await cache.clear();
```

### 带 TTL 过期

`setItem` 第三个参数为 TTL，单位毫秒。过期后读取返回默认值（惰性删除）：

```ts
import { StorageManager } from '@vben/utils';

const cache = new StorageManager({ prefix: 'session' });

// 设置 5 分钟后过期
await cache.setItem('token', 'abc123', 5 * 60 * 1000);

// 5 分钟内可以正常读取
const token = await cache.getItem('token');
// => 'abc123'

// 5 分钟后自动返回 null
const expiredToken = await cache.getItem('token');
// => null

// 主动清理所有过期项
await cache.clearExpiredItems();
```

## 存储驱动

### 本地存储驱动（默认）

`LocalStorageDriver`：基于浏览器 `localStorage` / `sessionStorage`，数据持久化存储。

```ts
import { LocalStorageDriver, StorageManager } from '@vben/utils';

// 使用 localStorage（默认）
const cache = new StorageManager({
  driver: new LocalStorageDriver(),
  prefix: 'app',
});

// 使用 sessionStorage
const sessionCache = new StorageManager({
  driver: new LocalStorageDriver({ storageType: 'sessionStorage' }),
  prefix: 'app',
});
```

**特点：**

- 同步 API 用 async 包装，保持接口统一
- 自动处理 JSON 序列化 / 反序列化
- 数据损坏时自动清除并返回 `null`
- 存储上限约 5–10MB（视浏览器而定）

**适用场景：** 用户偏好设置、小型配置数据、Token 存储

### IndexedDB 驱动

`IndexedDBDriver`：基于浏览器 IndexedDB，支持大容量结构化数据存储。

```ts
import { IndexedDBDriver, StorageManager } from '@vben/utils';

const cache = new StorageManager({
  driver: new IndexedDBDriver({
    dbName: 'my-app-db', // 数据库名称，默认 'vben-storage'
    dbVersion: 1, // 数据库版本，默认 1
    storeName: 'cache-store', // 对象存储名称，默认 'kv-store'
  }),
  prefix: 'data',
});

// 存储大量数据或复杂结构（IndexedDB 原生支持结构化克隆）
await cache.setItem('table-data', largeDataArray);
await cache.setItem('config', {
  columns: [...],
  filters: [...],
  pagination: { page: 1, size: 20 },
});
```

**特点：**

- 懒初始化：首次操作时自动打开数据库，无需手动调用 `init()`
- 存储容量大（通常数百 MB 到 GB 级别）
- 支持结构化克隆（可存储 Date、RegExp、Blob 等复杂类型）
- 天然异步，不阻塞主线程

**适用场景：** 离线数据缓存、大型表格数据、文件 / 图片缓存、复杂业务数据

### 内存存储驱动

`MemoryStorageDriver`：基于内存 `Map`，数据不持久化，页面刷新即丢失。

```ts
import { MemoryStorageDriver, StorageManager } from '@vben/utils';

const cache = new StorageManager({
  driver: new MemoryStorageDriver(),
  prefix: 'test',
});
```

**特点：**

- 读写速度最快
- 无浏览器 API 依赖
- 数据随页面生命周期销毁

**适用场景：** 单元测试、SSR 服务端渲染、临时运行时缓存

### Driver 对比

| 特性       | LocalStorageDriver  | IndexedDBDriver  | MemoryStorageDriver |
| ---------- | ------------------- | ---------------- | ------------------- |
| 持久化     | ✅                  | ✅               | ❌                  |
| 容量       | 5–10 MB             | 数百 MB+         | 受内存限制          |
| 速度       | 快（同步）          | 中等（异步 I/O） | 最快                |
| 数据类型   | 仅 JSON 可序列化    | 结构化克隆       | 任意 JS 对象        |
| 浏览器支持 | 所有现代浏览器      | 所有现代浏览器   | 任意环境            |
| 阻塞主线程 | 是                  | 否               | 否                  |
| 适用场景   | 配置、Token、小数据 | 离线缓存、大数据 | 测试、SSR           |

## API 参考

### StorageManager

#### 构造函数

```ts
new StorageManager(options?: StorageManagerOptions)
```

| 参数 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `driver` | `IStorageDriver` | 浏览器 `localStorage` 可用时 `new LocalStorageDriver()`，否则 `new MemoryStorageDriver()`（Safari 隐私模式、SSR/Node） | 存储驱动实例 |
| `prefix` | `string` | `''` | 键前缀，用于命名空间隔离 |

#### 方法

| 方法 | 签名 | 说明 |
| --- | --- | --- |
| `getItem` | `getItem<T>(key: string, defaultValue?: T \| null): Promise<T \| null>` | 获取存储项，过期或不存在返回默认值 |
| `setItem` | `setItem(key: string, value: unknown, ttl?: number): Promise<void>` | 设置存储项，可选 TTL（毫秒） |
| `removeItem` | `removeItem(key: string): Promise<void>` | 删除指定存储项 |
| `clear` | `clear(): Promise<void>` | 清除当前前缀下所有存储项 |
| `clearExpiredItems` | `clearExpiredItems(): Promise<void>` | 主动清理所有过期项 |
| `keys` | `keys(): Promise<string[]>` | 返回当前前缀下所有键（已去除前缀部分） |

### IStorageDriver 接口

自定义驱动需要实现此接口：

```ts
interface IStorageDriver {
  clear(): Promise<void>;
  getItem<T>(key: string): Promise<null | T>;
  keys(): Promise<string[]>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: unknown): Promise<void>;
}
```

## 高级用法

### 自定义 Driver

实现 `IStorageDriver` 接口即可对接任意存储引擎。以 Cookie 为例：

```ts
import type { IStorageDriver } from '@vben/utils';

class CookieStorageDriver implements IStorageDriver {
  async getItem<T>(key: string): Promise<null | T> {
    const value = getCookie(key);
    return value ? JSON.parse(value) : null;
  }

  async setItem(key: string, value: unknown): Promise<void> {
    setCookie(key, JSON.stringify(value));
  }

  async removeItem(key: string): Promise<void> {
    deleteCookie(key);
  }

  async clear(): Promise<void> {
    clearAllCookies();
  }

  async keys(): Promise<string[]> {
    return getAllCookieNames();
  }
}

const cache = new StorageManager({
  driver: new CookieStorageDriver(),
  prefix: 'ck',
});
```

### 根据环境动态选择 Driver

```ts
import {
  IndexedDBDriver,
  LocalStorageDriver,
  MemoryStorageDriver,
  StorageManager,
} from '@vben/utils';

function createStorageManager(prefix: string) {
  // SSR 环境使用内存驱动
  if (typeof window === 'undefined') {
    return new StorageManager({
      driver: new MemoryStorageDriver(),
      prefix,
    });
  }

  // 大数据场景使用 IndexedDB
  if (needsLargeStorage()) {
    return new StorageManager({
      driver: new IndexedDBDriver({ dbName: `${prefix}-db` }),
      prefix,
    });
  }

  // 默认使用 localStorage
  return new StorageManager({ prefix });
}
```

### 命名空间隔离

不同模块使用不同前缀，互不干扰：

```ts
const userCache = new StorageManager({ prefix: 'user' });
const configCache = new StorageManager({ prefix: 'config' });

await userCache.setItem('profile', { name: '张三' });
await configCache.setItem('profile', { theme: 'dark' });

await userCache.getItem('profile'); // => { name: '张三' }
await configCache.getItem('profile'); // => { theme: 'dark' }

// 只清除 user 前缀的数据，不影响 config
await userCache.clear();
await configCache.getItem('profile'); // => { theme: 'dark' }
```

### 定时清理过期数据

```ts
const cache = new StorageManager({ prefix: 'app' });

// 应用启动时清理一次
await cache.clearExpiredItems();

// 或者定时清理（每 10 分钟）
setInterval(
  async () => {
    await cache.clearExpiredItems();
  },
  10 * 60 * 1000,
);
```

## 数据存储格式

`StorageManager` 在 Driver 层存储的数据结构为：

```ts
interface StorageItem<T> {
  expiry?: number; // 过期时间戳（毫秒），undefined 表示永不过期
  value: T; // 实际业务数据
}
```

实际存储的 key 格式为 `{prefix}-{key}`。例如 `prefix = 'app'`、`key = 'user'`，实际存储键为 `app-user`。

## 过期策略

采用**惰性删除 + 主动清理**双重策略：

| 策略 | 触发时机 | 说明 |
| --- | --- | --- |
| 惰性删除 | 调用 `getItem` 时 | 读取时检查过期，过期则删除并返回默认值 |
| 主动清理 | 调用 `clearExpiredItems` 时 | 遍历所有带前缀的 key，删除已过期项 |

## 注意事项

1. **所有方法都是异步的** —— 即使底层是同步的 localStorage，API 也返回 Promise，确保切换 Driver 时无需改动调用方。
2. **TTL 单位是毫秒** —— `setItem('key', value, 60000)` 表示 60 秒后过期。
3. **IndexedDB 懒初始化** —— 不需要手动调用 `init()` 或 `open()`，首次操作时自动打开数据库连接并复用。
4. **前缀隔离是逻辑隔离** —— `clear()` 只清除当前前缀下的数据；当前缀为空时，`clear()` / `keys()` 会操作所选 Driver 中的所有 key。
5. **LocalStorageDriver 错误处理** —— JSON 解析失败时自动清除损坏数据并返回 `null`。
6. **IndexedDB 版本升级** —— 如需修改 objectStore 结构，递增 `dbVersion`；当前实现在 `upgradeneeded` 事件中自动创建 objectStore。
