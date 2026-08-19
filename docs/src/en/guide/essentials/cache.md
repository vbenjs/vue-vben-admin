---
outline: deep
---

# Cache

::: tip Preface

A strategy-pattern-based async storage solution that supports multiple backends (localStorage, IndexedDB, Memory) behind a unified API. All methods are async so callers need no changes when switching drivers.

:::

::: tip

`@vben/utils` re-exports the full cache module — business code can import everything uniformly from `@vben/utils`.

:::

## Architecture

```shell
┌───────────────────────────────────────────────┐
│             StorageManager                    │
│  ┌─────────────┐  ┌───────────────────────┐    │
│  │ Prefix isolation │ │   TTL expiry        │    │
│  └─────────────┘  └───────────────────────┘    │
├───────────────────────────────────────────────┤
│             IStorageDriver                    │
├──────────┬─────────────────┬──────────────────┤
│  Local   │   IndexedDB     │     Memory       │
│  Storage │   Driver        │     Driver        │
│  Driver  │                 │                  │
└──────────┴─────────────────┴──────────────────┘
```

**Layer responsibilities:**

| Layer | Responsibility |
| --- | --- |
| `StorageManager` | Namespace prefix isolation, TTL expiry checks, unified public API |
| `IStorageDriver` | Pure KV storage abstraction interface |
| Driver implementations | Talk to concrete storage engines, unaware of prefix or TTL |

## Quick Start

### Basic usage

When `driver` is omitted, the browser uses `LocalStorageDriver` if `localStorage` is available, otherwise falls back to `MemoryStorageDriver` (e.g. Safari private mode); SSR/Node uses `MemoryStorageDriver`:

```ts
import { StorageManager } from '@vben/utils';

const cache = new StorageManager({ prefix: 'myapp' });

// Write a value
await cache.setItem('user', { name: 'John', age: 28 });

// Read a value
const user = await cache.getItem('user');
// => { name: 'John', age: 28 }

// Read with a default value
const settings = await cache.getItem('settings', { theme: 'light' });
// Returns { theme: 'light' } if absent

// Delete a value
await cache.removeItem('user');

// Clear all entries under the current prefix
await cache.clear();
```

### With TTL expiry

The third argument of `setItem` is the TTL in milliseconds. Once expired, reads return the default value (lazy deletion):

```ts
import { StorageManager } from '@vben/utils';

const cache = new StorageManager({ prefix: 'session' });

// Expires in 5 minutes
await cache.setItem('token', 'abc123', 5 * 60 * 1000);

// Reads normally within 5 minutes
const token = await cache.getItem('token');
// => 'abc123'

// Returns null after 5 minutes
const expiredToken = await cache.getItem('token');
// => null

// Actively clean up all expired entries
await cache.clearExpiredItems();
```

## Storage Drivers

### Local storage driver (default)

`LocalStorageDriver`: based on the browser's `localStorage` / `sessionStorage`, data is persisted.

```ts
import { LocalStorageDriver, StorageManager } from '@vben/utils';

// Use localStorage (default)
const cache = new StorageManager({
  driver: new LocalStorageDriver(),
  prefix: 'app',
});

// Use sessionStorage
const sessionCache = new StorageManager({
  driver: new LocalStorageDriver({ storageType: 'sessionStorage' }),
  prefix: 'app',
});
```

**Characteristics:**

- Synchronous API wrapped in async to keep the interface unified
- Automatic JSON serialization / deserialization
- Corrupt data is auto-cleared and returns `null`
- Storage limit ~5–10MB (browser-dependent)

**Use cases:** user preferences, small config data, token storage

### IndexedDB driver

`IndexedDBDriver`: based on the browser's IndexedDB, supports large structured data storage.

```ts
import { IndexedDBDriver, StorageManager } from '@vben/utils';

const cache = new StorageManager({
  driver: new IndexedDBDriver({
    dbName: 'my-app-db', // Database name, default 'vben-storage'
    dbVersion: 1, // Database version, default 1
    storeName: 'cache-store', // Object store name, default 'kv-store'
  }),
  prefix: 'data',
});

// Store large or complex data (IndexedDB natively supports structured cloning)
await cache.setItem('table-data', largeDataArray);
await cache.setItem('config', {
  columns: [...],
  filters: [...],
  pagination: { page: 1, size: 20 },
});
```

**Characteristics:**

- Lazy initialization: opens the database on first operation, no manual `init()`
- Large capacity (typically hundreds of MB to GB)
- Supports structured cloning (Date, RegExp, Blob, etc.)
- Natively async, does not block the main thread

**Use cases:** offline data caching, large table data, file/image caching, complex business data

### Memory storage driver

`MemoryStorageDriver`: based on an in-memory `Map`, data is not persisted and is lost on page refresh.

```ts
import { MemoryStorageDriver, StorageManager } from '@vben/utils';

const cache = new StorageManager({
  driver: new MemoryStorageDriver(),
  prefix: 'test',
});
```

**Characteristics:**

- Fastest read/write
- No browser API dependency
- Data is destroyed with the page lifecycle

**Use cases:** unit tests, SSR rendering, temporary runtime caching

### Driver comparison

| Feature | LocalStorageDriver | IndexedDBDriver | MemoryStorageDriver |
| --- | --- | --- | --- |
| Persistence | ✅ | ✅ | ❌ |
| Capacity | 5–10 MB | Hundreds of MB+ | Memory-bound |
| Speed | Fast (sync) | Medium (async I/O) | Fastest |
| Data type | JSON-serializable only | Structured clone | Any JS object |
| Browser support | All modern browsers | All modern browsers | Any environment |
| Blocks main thread | Yes | No | No |
| Use case | Config, tokens, small data | Offline cache, big data | Tests, SSR |

## API Reference

### StorageManager

#### Constructor

```ts
new StorageManager(options?: StorageManagerOptions)
```

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| `driver` | `IStorageDriver` | `new LocalStorageDriver()` in browser when `localStorage` is available, `new MemoryStorageDriver()` otherwise (Safari private mode, SSR/Node) | Storage driver instance |
| `prefix` | `string` | `''` | Key prefix for namespace isolation |

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `getItem` | `getItem<T>(key: string, defaultValue?: T \| null): Promise<T \| null>` | Get an entry; returns the default if expired or absent |
| `setItem` | `setItem(key: string, value: unknown, ttl?: number): Promise<void>` | Set an entry, with optional TTL (ms) |
| `removeItem` | `removeItem(key: string): Promise<void>` | Delete the given entry |
| `clear` | `clear(): Promise<void>` | Clear all entries under the current prefix |
| `clearExpiredItems` | `clearExpiredItems(): Promise<void>` | Actively clean up all expired entries |
| `keys` | `keys(): Promise<string[]>` | Return all keys under the current prefix (prefix stripped) |

### IStorageDriver interface

Custom drivers implement this interface:

```ts
interface IStorageDriver {
  clear(): Promise<void>;
  getItem<T>(key: string): Promise<null | T>;
  keys(): Promise<string[]>;
  removeItem(key: string): Promise<void>;
  setItem(key: string, value: unknown): Promise<void>;
}
```

## Advanced Usage

### Custom Driver

Implement `IStorageDriver` to plug in any storage engine. Example with cookies:

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

### Dynamic driver selection by environment

```ts
import {
  IndexedDBDriver,
  LocalStorageDriver,
  MemoryStorageDriver,
  StorageManager,
} from '@vben/utils';

function createStorageManager(prefix: string) {
  // SSR environment uses the memory driver
  if (typeof window === 'undefined') {
    return new StorageManager({
      driver: new MemoryStorageDriver(),
      prefix,
    });
  }

  // Large-data scenarios use IndexedDB
  if (needsLargeStorage()) {
    return new StorageManager({
      driver: new IndexedDBDriver({ dbName: `${prefix}-db` }),
      prefix,
    });
  }

  // Default to localStorage
  return new StorageManager({ prefix });
}
```

### Namespace isolation

Different modules use different prefixes so they do not interfere:

```ts
const userCache = new StorageManager({ prefix: 'user' });
const configCache = new StorageManager({ prefix: 'config' });

await userCache.setItem('profile', { name: 'John' });
await configCache.setItem('profile', { theme: 'dark' });

await userCache.getItem('profile'); // => { name: 'John' }
await configCache.getItem('profile'); // => { theme: 'dark' }

// Clears only the user-prefixed data, config is unaffected
await userCache.clear();
await configCache.getItem('profile'); // => { theme: 'dark' }
```

### Scheduled cleanup of expired data

```ts
const cache = new StorageManager({ prefix: 'app' });

// Clean up once on app startup
await cache.clearExpiredItems();

// Or schedule it (every 10 minutes)
setInterval(
  async () => {
    await cache.clearExpiredItems();
  },
  10 * 60 * 1000,
);
```

## Storage Format

The structure `StorageManager` stores at the Driver layer:

```ts
interface StorageItem<T> {
  expiry?: number; // Expiry timestamp (ms); undefined means never expires
  value: T; // Actual business data
}
```

The actual stored key is formatted as `{prefix}-{key}`. For example, `prefix = 'app'`, `key = 'user'` produces the stored key `app-user`.

## Expiry Strategy

A dual strategy of **lazy deletion + active cleanup**:

| Strategy | When | Description |
| --- | --- | --- |
| Lazy deletion | On `getItem` | Checks expiry on read; deletes and returns the default if expired |
| Active cleanup | On `clearExpiredItems` | Iterates all prefixed keys and deletes expired ones |

## Notes

1. **All methods are async** — even the synchronous localStorage is wrapped in Promises so callers need no changes when switching drivers.
2. **TTL is in milliseconds** — `setItem('key', value, 60000)` expires in 60 seconds.
3. **IndexedDB lazy initialization** — no manual `init()` or `open()`; the DB connection is opened on first operation and reused.
4. **Prefix isolation is logical** — `clear()` only clears data under the current prefix; with an empty prefix, `clear()` / `keys()` operate on all keys in the selected driver.
5. **LocalStorageDriver error handling** — auto-clears corrupt data on JSON parse failure and returns `null`.
6. **IndexedDB version upgrade** — increment `dbVersion` to modify the objectStore structure; the current implementation creates the objectStore in the `upgradeneeded` handler.
