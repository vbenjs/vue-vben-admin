---
outline: deep
---

# Vben Drawer

`Vben Drawer` is the shared drawer wrapper used by the framework. It supports auto-height layout, loading state, connected components, and an imperative API similar to the modal API.

## Basic Usage

```ts
const [Drawer, drawerApi] = useVbenDrawer({
  // props
  // events
});
```

<DemoPreview dir="demos/vben-drawer/basic" />

## Current Usage Notes

- If you use `connectedComponent`, the inner and outer components share data through `drawerApi.setData()` and `drawerApi.getData()`.
- Default drawer behavior can be adjusted in `apps/<app>/src/bootstrap.ts` through `setDefaultDrawerProps(...)`.
- `setState(...)` works on `DrawerState`, not `ModalState`.

## Shared Data Types

The recommended approach is to declare the data type once in the connected component and expose `drawerApi`. The outer call then infers the data contract from `connectedComponent`:

```ts
// Connected component
const [Drawer, drawerApi] = useVbenDrawer<EditData>();
defineExpose({ drawerApi });

// Outer component, EditData is inferred
const [Drawer, drawerApi] = useVbenDrawer({
  connectedComponent: EditDrawer,
});
```

Use `useVbenDrawer<EditData>()` explicitly when the component type cannot expose the contract. For larger features, pre-bind one reusable contract in a separate module:

```ts
export const useEditDrawer = createVbenDrawer<EditData>();
```

The precedence is explicit generic, connected component inference, then `unknown`. Plain SFCs support inference through `defineExpose`; generic SFCs, functional components, and components widened to `Component` should use an explicit generic or contract factory. `getData()` returns `undefined` before `setData()` is called. Include `null` or partial payloads in the data type when they are valid business values.

## Key Props

| Prop | Description | Type |
| --- | --- | --- |
| `appendToMain` | mount inside the main content area instead of `body` | `boolean` |
| `connectedComponent` | connect an inner component to the drawer wrapper | `Component` |
| `closeIconPlacement` | position of the close icon | `'left' \| 'right'` |
| `placement` | drawer side | `'left' \| 'right' \| 'top' \| 'bottom'` |
| `overlayBlur` | blur amount for the overlay | `number` |
| `submitting` | lock drawer interactions while submitting | `boolean` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `onBeforeClose` | called before close; returning `false` or rejecting prevents close | `() => Promise<boolean \| undefined> \| boolean \| undefined` |
| `onOpenChange` | called when open state changes | `(isOpen: boolean) => void` |
| `onOpened` | called after open animation completes | `() => void` |
| `onClosed` | called after close animation completes | `() => void` |

## drawerApi

| Method                  | Description                            |
| ----------------------- | -------------------------------------- |
| `setState(...)`         | updates drawer state                   |
| `open()`                | opens the drawer                       |
| `close()`               | closes the drawer                      |
| `setData(data: TData)`  | stores typed shared data               |
| `getData()`             | returns `TData \| undefined`           |
| `lock(isLocked = true)` | locks the drawer into submitting state |
| `unlock()`              | alias for `lock(false)`                |
