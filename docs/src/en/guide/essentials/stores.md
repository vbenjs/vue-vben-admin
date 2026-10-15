---
outline: deep
---

# Stores

::: tip

`@vben/stores` is already imported uniformly under each `app`; no separate installation is needed. The package also re-exports `pinia`'s `defineStore` and `storeToRefs`, so business code can import them uniformly from `@vben/stores`.

:::

## User Store

`useUserStore`, store id `core-user`. Wraps user info and roles.

::: details UserState definition

| Field       | Default | Description |
| ----------- | ------- | ----------- |
| `userInfo`  | `null`  | User info   |
| `userRoles` | `[]`    | User roles  |

:::

### Set user info

`setUserInfo(userInfo)`: Sets user info and syncs roles from `userInfo.roles` into `userRoles`.

```ts
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
userStore.setUserInfo({ id: 1, name: 'vben', roles: ['admin'] });
userStore.userRoles; // ['admin']
```

`useUserStore` has no `persist` configured — user info is runtime state, usually returned by an API after login and invalidated on logout.

### Set user roles

`setUserRoles(roles)`: Directly sets the user role list.

```ts
import { useUserStore } from '@vben/stores';

const userStore = useUserStore();
userStore.setUserRoles(['admin', 'editor']);
userStore.userRoles; // ['admin', 'editor']
```

### Get user info

`useUserStore` has no dedicated getter — read the state directly. Use `storeToRefs` to destructure while keeping reactivity.

```ts
import { storeToRefs, useUserStore } from '@vben/stores';

const userStore = useUserStore();

// Direct access
userStore.userInfo;
userStore.userRoles;

// Keep reactivity
const { userInfo, userRoles } = storeToRefs(userStore);
```

## Timezone Store

`useTimezoneStore`, store id `core-timezone`. A setup-style store wrapping timezone state.

::: details Exposed state and methods

| Name | Description |
| --- | --- |
| `timezone` | Current timezone; initial value comes from `getCurrentTimezone()` |
| `setTimezone(timezone)` | Set the timezone and sync it to the dayjs default timezone |
| `getTimezoneOptions()` | Get the timezone option list; defaults to `DEFAULT_TIME_ZONE_OPTIONS` |
| `$reset()` | Reset the timezone to `getCurrentTimezone()` |

:::

### Set timezone

`setTimezone(timezone)`: Sets the current timezone and syncs it to the dayjs default timezone (`dayjs.tz.setDefault`).

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
await store.setTimezone('America/New_York');
store.timezone; // 'America/New_York'
```

### Get timezone options

`getTimezoneOptions()`: Returns the timezone option list, defaults to `DEFAULT_TIME_ZONE_OPTIONS`; can be overridden via `setTimezoneHandler`.

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
const options = await store.getTimezoneOptions();
// [{ label: 'UTC+8', value: 'Asia/Shanghai' }, ...]
```

### Reset timezone

`$reset()`: Resets `timezone` to the current timezone returned by `getCurrentTimezone()`. It only resets the store's internal ref and does **not** sync dayjs's default timezone (only `setTimezone` does).

```ts
import { useTimezoneStore } from '@vben/stores';

const store = useTimezoneStore();
store.$reset();
store.timezone; // back to the value of getCurrentTimezone()
```

### Inject custom timezone handler

`setTimezoneHandler`: Injects a custom timezone handler module that can override `getTimezone` / `getTimezoneOptions` / `setTimezone`, useful for persisting user timezone preferences via a backend API.

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
    return [{ label: 'UTC+8', value: 'Asia/Shanghai' }];
  },
});

const store = useTimezoneStore();
await store.setTimezone('Asia/Shanghai');
```

### Persistence strategy

```ts
persist: {
  pick: ['timezone'];
}
```

The `timezone` field is persisted and preserved on page refresh; the handler logic injected by `setTimezoneHandler` is runtime config and is not persisted.

## Dictionary Store

`useDictStore`, store id `core-dict`. A setup-style store for dictionary caching. The store itself does not call any backend API; inject fetchers via `setDictHandler`.

::: details Exposed state and methods

| Name | Description |
| --- | --- |
| `dictMap` | Dictionary cache shaped as `{ [code]: DictItem[] }` |
| `version` | Cached dictionary version |
| `getDict(code)` | Async fetch with cache and request dedupe |
| `getDictSync(code)` | Sync read; triggers a background load on miss |
| `getDictItem(code, value)` | Find an item by value |
| `getDictLabel(code, value)` | Get a label by value; returns the original value when missing |
| `loadAllDicts(force?)` | Preload all dictionaries with optional version check |
| `refreshDict(code?)` | Clear one or all dictionary caches |
| `$reset()` | Clear cache and in-flight requests |

:::

### Inject a custom dictionary handler

`setDictHandler` injects `getDict` / `getAllDicts` / `getVersion`.

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

### On-demand reads

```ts
import { useDictStore } from '@vben/stores';

const store = useDictStore();

// Async (can be used as ApiSelect `api`)
const options = await store.getDict('user_gender');

// Sync (reactive), for RadioGroup and similar components
const syncOptions = store.getDictSync('user_gender');

// Translate a value
store.getDictLabel('user_gender', 1); // 'Male'
```

### Preload and version check

Call `loadAllDicts()` after login or when routes are first generated. If `getVersion` is provided and the remote version matches a warm local cache, the request is skipped. Pass `force: true` to refresh anyway.

### Use in tables

After registering `CellDict` in the app's `adapter/vxe-table.ts`:

```ts
{
  field: 'gender',
  cellRender: {
    name: 'CellDict',
    props: { code: 'user_gender' },
  },
}
```

> `CellDict` is an application-level renderer, not part of `@vben/stores`. The playground ships an example implementation.

### Use in forms

```ts
const dictStore = useDictStore();

// Select: ApiSelect + getDict
{
  component: 'ApiSelect',
  componentProps: {
    api: () => dictStore.getDict('user_gender'),
  },
  fieldName: 'gender',
}

// Radio: function componentProps + getDictSync
{
  component: 'RadioGroup',
  componentProps: () => ({
    options: dictStore.getDictSync('user_gender'),
  }),
  fieldName: 'gender',
}
```

### Refresh and reset

- After admin edits, call `refreshDict(code)` so the current session reloads immediately.
- Logout runs `$reset()` via `resetAllStores`; responses that arrive after logout are discarded.
- If the backend returns labels by locale, call `refreshDict()` after switching language.

### Persistence strategy

```ts
persist: {
  pick: ['dictMap', 'version'];
}
```

`dictMap` and `version` are persisted. Without `getVersion`, the cache remains until logout or a manual `refreshDict`.
