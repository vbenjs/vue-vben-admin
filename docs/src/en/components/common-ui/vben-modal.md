---
outline: deep
---

# Vben Modal

`Vben Modal` is the shared modal wrapper used by the framework. It supports draggable behavior, fullscreen mode, auto-height handling, loading state, connected components, and an imperative API.

## Basic Usage

```ts
const [Modal, modalApi] = useVbenModal({
  // props
  // events
});
```

<DemoPreview dir="demos/vben-modal/basic" />

## Current Usage Notes

- If you use `connectedComponent`, the inner and outer components share data through `modalApi.setData()` and `modalApi.getData()`.
- When `connectedComponent` is present, avoid pushing extra modal props through the connected side. Prefer `useVbenModal(...)` or `modalApi.setState(...)`.
- Default modal behavior can be adjusted in `apps/<app>/src/bootstrap.ts` through `setDefaultModalProps(...)`.

## Key Props

| Prop | Description | Type |
| --- | --- | --- |
| `appendToMain` | mount inside the main content area instead of `body` | `boolean` |
| `connectedComponent` | connect an inner component to the modal wrapper | `Component` |
| `animationType` | modal enter/leave animation | `'slide' \| 'scale'` |
| `fullscreenButton` | show or hide the fullscreen toggle | `boolean` |
| `overlayBlur` | blur amount for the overlay | `number` |
| `submitting` | lock modal interactions while submitting | `boolean` |

## Events

| Event | Description | Type |
| --- | --- | --- |
| `onBeforeClose` | called before close; returning `false` or rejecting prevents close | `() => Promise<boolean \| undefined> \| boolean \| undefined` |
| `onOpenChange` | called when open state changes | `(isOpen: boolean) => void` |
| `onOpened` | called after open animation completes | `() => void` |
| `onClosed` | called after close animation completes | `() => void` |

## modalApi

| Method                  | Description                           |
| ----------------------- | ------------------------------------- |
| `setState(...)`         | updates modal state                   |
| `open()`                | opens the modal                       |
| `close()`               | closes the modal                      |
| `setData(data)`         | stores shared data                    |
| `getData<T>()`          | reads shared data                     |
| `lock(isLocked = true)` | locks the modal into submitting state |
| `unlock()`              | alias for `lock(false)`               |
