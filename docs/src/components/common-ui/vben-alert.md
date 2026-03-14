---
outline: deep
---

# Vben Alert 轻量提示框

`Alert` 提供了一组纯 JavaScript 调用的轻量提示框能力，适合快速创建 `alert`、`confirm`、`prompt` 这类简单交互。

::: info 适用场景

`Alert` 与 `Modal` 的能力有部分重叠，但更适合临时确认、简单提示和轻量输入场景。复杂弹窗仍然建议使用 `Vben Modal`。:::

::: tip 注意

通过 `alert`、`confirm`、`prompt` 动态创建的弹窗，在已经打开的情况下不支持 HMR 热更新。修改相关代码后，需要关闭后重新打开。:::

## 基础用法

使用 `alert` 创建只有确认按钮的提示框。

<DemoPreview dir="demos/vben-alert/alert" />

使用 `confirm` 创建带确认和取消按钮的提示框。

<DemoPreview dir="demos/vben-alert/confirm" />

使用 `prompt` 创建可接收用户输入的提示框。

<DemoPreview dir="demos/vben-alert/prompt" />

## useAlertContext

当 `content`、`footer` 或 `icon` 使用的是自定义组件时，可以在这些组件内部通过 `useAlertContext()` 获取当前弹窗上下文，并主动触发确认或取消。

::: tip 注意

`useAlertContext` 只能在 `setup` 或函数式组件中使用。:::

### Methods

| 方法      | 描述                   | 类型         | 版本要求 |
| --------- | ---------------------- | ------------ | -------- |
| doConfirm | 触发当前弹窗的确认操作 | `() => void` | `>5.5.4` |
| doCancel  | 触发当前弹窗的取消操作 | `() => void` | `>5.5.4` |

## 类型说明

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

export function alert(options: AlertProps): Promise<void>;
export function alert(
  message: string,
  options?: Partial<AlertProps>,
): Promise<void>;
export function alert(
  message: string,
  title?: string,
  options?: Partial<AlertProps>,
): Promise<void>;

export async function prompt<T = any>(
  options: Omit<AlertProps, 'beforeClose'> & {
    beforeClose?: (
      scope: BeforeCloseScope & {
        value: T;
      },
    ) => boolean | Promise<boolean | undefined> | undefined;
    component?: Component;
    componentProps?: Recordable<any>;
    defaultValue?: T;
    modelPropName?: string;
  },
): Promise<T | undefined>;
```
