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

## Shared Data Types

The recommended approach is to declare the data type once in the connected component and expose `modalApi`. The outer call then infers the data contract from `connectedComponent`:

```ts
// Connected component
const [Modal, modalApi] = useVbenModal<EditData>();
defineExpose({ modalApi });

// Outer component, EditData is inferred
const [Modal, modalApi] = useVbenModal({
  connectedComponent: EditModal,
});
```

Use `useVbenModal<EditData>()` explicitly when the component type cannot expose the contract. For larger features, pre-bind one reusable contract in a separate module:

```ts
export const useEditModal = createVbenModal<EditData>();
```

The precedence is explicit generic, connected component inference, then `unknown`. Plain SFCs support inference through `defineExpose`; generic SFCs, functional components, and components widened to `Component` should use an explicit generic or contract factory. `getData()` returns `undefined` before `setData()` is called. Include `null` or partial payloads in the data type when they are valid business values.

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
| `setData(data: TData)`  | stores typed shared data              |
| `getData()`             | returns `TData \| undefined`          |
| `lock(isLocked = true)` | locks the modal into submitting state |
| `unlock()`              | alias for `lock(false)`               |
