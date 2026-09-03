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
