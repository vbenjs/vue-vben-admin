---
outline: deep
---

# Vben Alert

`Alert` provides lightweight JavaScript-driven dialogs for simple `alert`, `confirm`, and `prompt` style interactions.

## Basic Usage

Use `alert` for a single confirm button dialog:

<DemoPreview dir="demos/vben-alert/alert" />

Use `confirm` for confirm/cancel interactions:

<DemoPreview dir="demos/vben-alert/confirm" />

Use `prompt` when you need simple user input:

<DemoPreview dir="demos/vben-alert/prompt" />

## useAlertContext

If `content`, `footer`, or `icon` is rendered through a custom component, you can call `useAlertContext()` inside that component to access the current dialog actions.

| Method      | Description                | Type         |
| ----------- | -------------------------- | ------------ |
| `doConfirm` | trigger the confirm action | `() => void` |
| `doCancel`  | trigger the cancel action  | `() => void` |

## Core Types

```ts
export type IconType = 'error' | 'info' | 'question' | 'success' | 'warning';

export type BeforeCloseScope = {
  isConfirm: boolean;
};

export type AlertProps = {
  beforeClose?: (
    scope: BeforeCloseScope,
  ) => boolean | Promise<boolean | undefined> | undefined;
  bordered?: boolean;
  buttonAlign?: 'center' | 'end' | 'start';
  cancelText?: string;
  centered?: boolean;
  confirmText?: string;
  containerClass?: string;
  content: Component | string;
  contentClass?: string;
  contentMasking?: boolean;
  footer?: Component | string;
  icon?: Component | IconType;
  overlayBlur?: number;
  showCancel?: boolean;
  title?: string;
};

export type PromptProps<T = any> = {
  beforeClose?: (scope: {
    isConfirm: boolean;
    value: T | undefined;
  }) => boolean | Promise<boolean | undefined> | undefined;
  component?: Component;
  componentProps?: Recordable<any>;
  componentSlots?:
    | (() => any)
    | Recordable<unknown>
    | VNode
    | VNodeArrayChildren;
  defaultValue?: T;
  modelPropName?: string;
} & Omit<AlertProps, 'beforeClose'>;
```
