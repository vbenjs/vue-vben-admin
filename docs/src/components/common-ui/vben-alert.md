---
outline: deep
---

# Vben Alert 轻量提示框

框架提供的一些用于轻量提示的弹窗，仅使用js代码即可快速动态创建提示而不需要在template写任何代码。

::: info 应用场景

Alert提供的功能与Modal类似，但只适用于简单应用场景。例如临时性、动态地弹出模态确认框、输入框等。如果对弹窗有更复杂的需求，请使用VbenModal

:::

::: tip README

下方示例代码中的，存在一些主题色未适配、样式缺失的问题，这些问题只在文档内会出现，实际使用并不会有这些问题，可忽略，不必纠结。

:::

## 基础用法

使用 `alert` 创建只有一个确认按钮的提示框。

<DemoPreview dir="demos/vben-alert/alert" />

使用 `confirm` 创建有确认和取消按钮的提示框。

<DemoPreview dir="demos/vben-alert/confirm" />

使用 `prompt` 创建有确认和取消按钮、接受用户输入的提示框。

<DemoPreview dir="demos/vben-alert/prompt" />

## 类型说明

```ts
/** 预置的图标类型 */
export type IconType = 'error' | 'info' | 'question' | 'success' | 'warning';

export type BeforeCloseScope = {
  /** 是否为点击确认按钮触发的关闭 */
  isConfirm: boolean;
};

export type AlertProps = {
  /** 关闭前的回调，如果返回false，则终止关闭 */
  beforeClose?: (
    scope: BeforeCloseScope,
  ) => boolean | Promise<boolean | undefined> | undefined;
  /** 边框 */
  bordered?: boolean;
  /** 取消按钮的标题 */
  cancelText?: string;
  /** 是否居中显示 */
  centered?: boolean;
  /** 确认按钮的标题 */
  confirmText?: string;
  /** 弹窗容器的额外样式 */
  containerClass?: string;
  /** 弹窗提示内容 */
  content: Component | string;
  /** 弹窗内容的额外样式 */
  contentClass?: string;
  /** 弹窗的图标（在标题的前面） */
  icon?: Component | IconType;
  /** 是否显示取消按钮 */
  showCancel?: boolean;
  /** 弹窗标题 */
  title?: string;
};

/**
 * 函数签名
 * alert和confirm的函数签名相同。
 * confirm默认会显示取消按钮，而alert默认只有一个按钮
 *  */
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

/**
 * 弹出输入框的函数签名。
 * beforeClose的参数会传入用户当前输入的值
 * component指定接受用户输入的组件，默认为Input
 * componentProps 为输入组件设置的属性数据
 * defaultValue 默认的值
 * modelPropName 输入组件的值属性名称。默认为modelValue
 */
export async function prompt<T = any>(
  options: Omit<AlertProps, 'beforeClose'> & {
    beforeClose?: (
      scope: BeforeCloseScope & {
        /** 输入组件的当前值 */
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
