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
| `setData(data)`         | stores shared data                     |
| `getData<T>()`          | reads shared data                      |
| `lock(isLocked = true)` | locks the drawer into submitting state |
| `unlock()`              | alias for `lock(false)`                |
