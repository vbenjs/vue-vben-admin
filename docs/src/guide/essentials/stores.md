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

| 字段        | 默认值 | 说明     |
| ----------- | ------ | -------- |
| `userInfo`  | `null` | 用户信息 |
| `userRoles` | `[]`   | 用户角色 |

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
persist: {
  pick: ['timezone'];
}
```

`timezone` 字段会被持久化，刷新页面后保留；`setTimezoneHandler` 注入的处理逻辑属于运行时配置，不持久化。

## 字典 Store

`useDictStore`，store id 为 `core-dict`，采用 setup store 风格封装字典缓存。业务侧通过 `setDictHandler` 注入取数方法，store 本身不依赖任何后端接口。

::: details 暴露的状态与方法

| 名称                        | 说明                                    |
| --------------------------- | --------------------------------------- |
| `dictMap`                   | 字典缓存，形如 `{ [code]: DictItem[] }` |
| `version`                   | 本地缓存的字典版本号                    |
| `getDict(code)`             | 异步获取字典项（带缓存与并发合并）      |
| `getDictSync(code)`         | 同步读取字典项；未命中时后台触发加载    |
| `getDictItem(code, value)`  | 按值查找字典项                          |
| `getDictLabel(code, value)` | 按值获取标签；找不到时返回原值          |
| `loadAllDicts(force?)`      | 全量预加载，支持版本校验                |
| `refreshDict(code?)`        | 清除某个或全部字典缓存                  |
| `$reset()`                  | 清空缓存与进行中的请求                  |

:::

### 注入自定义字典处理器

`setDictHandler`：注入自定义的字典处理模块，可覆盖 `getDict` / `getAllDicts` / `getVersion`。

```ts
import { setDictHandler, useDictStore } from '@vben/stores';

setDictHandler({
  getDict(code) {
    return requestClient.get('/dict/data', { params: { code } });
  },
  getAllDicts() {
    return requestClient.get('/dict/all');
  },
  getVersion() {
    return requestClient.get('/dict/version');
  },
});

const store = useDictStore();
await store.loadAllDicts();
```

### 按需读取

```ts
import { useDictStore } from '@vben/stores';

const store = useDictStore();

// 异步（可直接作为 ApiSelect 的 api）
const options = await store.getDict('user_gender');

// 同步读取（响应式），适合 RadioGroup 等只接受同步 options 的组件
const syncOptions = store.getDictSync('user_gender');

// 翻译值
store.getDictLabel('user_gender', 1); // '男'
```

### 预加载与版本校验

登录后或路由首次生成时调用 `loadAllDicts()`。若注入了 `getVersion`，版本号与本地一致且缓存非空时会跳过请求；传入 `force: true` 可强制刷新。

### 在表格中使用

在应用的 `adapter/vxe-table.ts` 中注册 `CellDict` 后：

```ts
{
  field: 'gender',
  cellRender: {
    name: 'CellDict',
    props: { code: 'user_gender' },
  },
}
```

> `CellDict` 属于应用层渲染器，不在 `@vben/stores` 内；playground 已提供示例实现。

### 在表单中使用

```ts
const dictStore = useDictStore();

// 下拉：ApiSelect + getDict
{
  component: 'ApiSelect',
  componentProps: {
    api: () => dictStore.getDict('user_gender'),
  },
  fieldName: 'gender',
}

// 单选：函数式 componentProps + getDictSync
{
  component: 'RadioGroup',
  componentProps: () => ({
    options: dictStore.getDictSync('user_gender'),
  }),
  fieldName: 'gender',
}
```

### 刷新与重置

- 管理端修改字典后调用 `refreshDict(code)`，当前会话会立即重新拉取。
- 登出时 `resetAllStores` 会调用 `$reset()` 清空缓存；登出前发出、登出后才返回的请求结果会被丢弃。
- 若后端按语言返回 label，切换语言后需调用 `refreshDict()`。

### 持久化策略

```ts
persist: {
  pick: ['dictMap', 'version'];
}
```

`dictMap` 与 `version` 会被持久化。未提供 `getVersion` 时，缓存会一直保留到登出或手动 `refreshDict`。
