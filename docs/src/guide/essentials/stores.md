---
outline: deep
---

# 状态管理

::: tip

`@vben/stores` 已在各 `app` 下统一引入，无需单独安装。包内同时重新导出了 `pinia` 的 `defineStore` 与 `storeToRefs`，业务侧可统一从 `@vben/stores` 引入。

:::

## 用户信息 Store

`useUserStore`，store id 为 `core-user`，封装用户信息与角色。

::: details UserState 状态定义

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `userInfo` | `null` | 用户信息 |
| `userRoles` | `[]` | 用户角色 |

:::

### 设置用户信息

`setUserInfo(userInfo)`：设置用户信息，并自动从 `userInfo.roles` 同步角色到 `userRoles`。

```ts
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
userStore.setUserInfo({ id: 1, name: 'vben', roles: ['admin'] });
userStore.userRoles; // ['admin']
```

`useUserStore` 未配置 `persist`——用户信息属于运行时态，通常在登录后由接口返回，退出登录后即随之失效。

### 设置用户角色

`setUserRoles(roles)`：直接设置用户角色列表。

```ts
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
userStore.setUserRoles(['admin', 'editor']);
userStore.userRoles; // ['admin', 'editor']
```

### 获取用户信息

`useUserStore` 未提供专门的 getter，直接访问 state 即可读取。需要响应式时用 `storeToRefs` 解构。

```ts
import { storeToRefs, useUserStore } from '@vben/stores';

const userStore = useUserStore();

// 直接访问
userStore.userInfo;
userStore.userRoles;

// 保持响应式
const { userInfo, userRoles } = storeToRefs(userStore);
```

## 时区 Store

`useTimezoneStore`，store id 为 `core-timezone`，采用 setup store 风格封装时区状态。

::: details 暴露的状态与方法

| 名称 | 说明 |
| --- | --- |
| `timezone` | 当前时区，初始值取自 `getCurrentTimezone()` |
| `setTimezone(timezone)` | 设置时区，并同步到 dayjs 默认时区 |
| `getTimezoneOptions()` | 获取时区选项列表，默认来自 `DEFAULT_TIME_ZONE_OPTIONS` |
| `$reset()` | 重置时区到 `getCurrentTimezone()` |

:::

### 设置时区

`setTimezone(timezone)`：设置当前时区，并同步到 dayjs 默认时区（`dayjs.tz.setDefault`）。

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
await store.setTimezone('America/New_York');
store.timezone; // 'America/New_York'
```

### 获取时区选项列表

`getTimezoneOptions()`：返回时区选项列表，默认来自 `DEFAULT_TIME_ZONE_OPTIONS`，可被 `setTimezoneHandler` 覆盖。

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
const options = await store.getTimezoneOptions();
// [{ label: '东八区', value: 'Asia/Shanghai' }, ...]
```

### 重置时区

`$reset()`：将 `timezone` 重置为 `getCurrentTimezone()` 返回的当前时区。仅重置 store 内部引用，**不会**同步 dayjs 默认时区（只有 `setTimezone` 会同步）。

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
store.$reset();
store.timezone; // 回到 getCurrentTimezone() 的值
```

### 注入自定义时区处理器

`setTimezoneHandler`：注入自定义的时区处理模块，可覆盖 `getTimezone` / `getTimezoneOptions` / `setTimezone` 三个方法，便于对接后端接口存储用户时区偏好。

```ts
import { setTimezoneHandler, useTimezoneStore } from '@vben/stores';

setTimezoneHandler({
  async getTimezone() {
    return (await fetchUserSettings()).timezone;
  },
  async setTimezone(timezone) {
    await saveUserSettings({ timezone });
  },
  async getTimezoneOptions() {
    return [{ label: '东八区', value: 'Asia/Shanghai' }];
  },
});

const store = useTimezoneStore();
await store.setTimezone('Asia/Shanghai');
```

### 持久化策略

```ts
persist: { pick: ['timezone'] }
```

`timezone` 字段会被持久化，刷新页面后保留；`setTimezoneHandler` 注入的处理逻辑属于运行时配置，不持久化。
