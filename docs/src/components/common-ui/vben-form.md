---
outline: deep
---

# Vben Form 表单

框架提供的表单组件，可适配 `Element Plus`、`Ant Design Vue`、`Naive UI` 等框架。

> 如果文档内没有参数说明，可以尝试在在线示例内寻找

::: info 写在前面

如果你觉得现有组件的封装不够理想，或者不完全符合你的需求，大可以直接使用原生组件，亦或亲手封装一个适合的组件。框架提供的组件并非束缚，使用与否，完全取决于你的需求与自由。

:::

## 适配器

表单内部使用 [TanStack Form](https://tanstack.com/form/latest/docs/framework/vue/overview) 管理状态与校验生命周期，并使用 [Zod 4](https://zod.dev/v4) 描述 schema。业务侧仍通过 `useVbenForm`、`FormApi` 和组件适配器使用表单，不应直接依赖底层 TanStack 实例。

从 Zod 3 或旧表单引擎升级时，请先阅读 [Zod 4 与 TanStack Form 迁移指南](/guide/in-depth/zod-v4-form-migration)。

### 适配器说明

每个应用都有不同的 UI 框架，所以在应用的 `src/adapter/form` 和 `src/adapter/component` 内部，你可以根据自己的需求，进行组件适配。下面是 `Ant Design Vue` 的适配器示例代码，可根据注释查看说明：

::: details ant design vue 表单适配器

```ts
import type {
  FormValues,
  VbenFormProps as FormProps,
  VbenFormSchema as FormSchema,
} from '@vben/common-ui';

import type { ComponentType } from './component';

import { setupVbenForm, useVbenForm as useForm, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { initComponentAdapter } from './component';

initComponentAdapter();
setupVbenForm<ComponentType>({
  config: {
    // ant design vue组件库默认都是 v-model:value
    baseModelPropName: 'value',
    // 仅当组件不发送 update:*、只发送 change 时启用
    changeEventFallback: false,
    // 一些组件库空值为 null，重置表单时需要和实际组件行为保持一致
    emptyStateValue: null,
    // 一些组件是 v-model:checked 或者 v-model:fileList
    modelPropNameMap: {
      Checkbox: 'checked',
      Radio: 'checked',
      Switch: 'checked',
      Upload: 'fileList',
    },
  },
  rules: {
    // 输入项目必填国际化适配
    required: (value, _params, ctx) => {
      if (value === undefined || value === null || value.length === 0) {
        return $t('ui.formRules.required', [ctx.label]);
      }
      return true;
    },
    // 选择项目必填国际化适配
    selectRequired: (value, _params, ctx) => {
      if (value === undefined || value === null) {
        return $t('ui.formRules.selectRequired', [ctx.label]);
      }
      return true;
    },
  },
});

function useVbenForm<TValues extends FormValues = FormValues>(
  options: FormProps<ComponentType, Record<never, never>, TValues>,
) {
  return useForm<TValues, ComponentType, Record<never, never>>(options);
}

export { useVbenForm, z };
export type VbenFormSchema<TValues extends FormValues = FormValues> =
  FormSchema<ComponentType, Record<never, never>, TValues>;
export type VbenFormProps<TValues extends FormValues = FormValues> = FormProps<
  ComponentType,
  Record<never, never>,
  TValues
>;
```

:::

::: details ant design vue 组件适配器

```ts
/**
 * 通用组件共同的使用的基础组件，原先放在 adapter/form 内部，限制了使用范围，这里提取出来，方便其他地方使用
 * 可用于 vben-form、vben-modal、vben-drawer 等组件使用,
 */

import type { BaseFormComponentType } from '@vben/common-ui';

import type { Component, SetupContext } from 'vue';
import { h } from 'vue';

import { globalShareState } from '@vben/common-ui';
import { $t } from '@vben/locales';
import {
  AutoComplete,
  Button,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  Divider,
  Input,
  InputNumber,
  InputPassword,
  Mentions,
  notification,
  Radio,
  RadioGroup,
  RangePicker,
  Rate,
  Select,
  Space,
  Switch,
  Textarea,
  TimePicker,
  TreeSelect,
  Upload,
} from 'antdv-next';

const withDefaultPlaceholder = <T extends Component>(
  component: T,
  type: 'input' | 'select',
) => {
  return (props: any, { attrs, slots }: Omit<SetupContext, 'expose'>) => {
    const placeholder = props?.placeholder || $t(`ui.placeholder.${type}`);
    return h(component, { ...props, ...attrs, placeholder }, slots);
  };
};

// 这里需要自行根据业务组件库进行适配，需要用到的组件都需要在这里类型说明
export type ComponentType =
  | 'AutoComplete'
  | 'Checkbox'
  | 'CheckboxGroup'
  | 'DatePicker'
  | 'DefaultButton'
  | 'Divider'
  | 'Input'
  | 'InputNumber'
  | 'InputPassword'
  | 'Mentions'
  | 'PrimaryButton'
  | 'Radio'
  | 'RadioGroup'
  | 'RangePicker'
  | 'Rate'
  | 'Select'
  | 'Space'
  | 'Switch'
  | 'Textarea'
  | 'TimePicker'
  | 'TreeSelect'
  | 'Upload'
  | BaseFormComponentType;

async function initComponentAdapter() {
  const components: Partial<Record<ComponentType, Component>> = {
    // 如果你的组件体积比较大，可以使用异步加载
    // Button: () =>
    // import('xxx').then((res) => res.Button),

    AutoComplete,
    Checkbox,
    CheckboxGroup,
    DatePicker,
    // 自定义默认按钮
    DefaultButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'default' }, slots);
    },
    Divider,
    Input: withDefaultPlaceholder(Input, 'input'),
    InputNumber: withDefaultPlaceholder(InputNumber, 'input'),
    InputPassword: withDefaultPlaceholder(InputPassword, 'input'),
    Mentions: withDefaultPlaceholder(Mentions, 'input'),
    // 自定义主要按钮
    PrimaryButton: (props, { attrs, slots }) => {
      return h(Button, { ...props, attrs, type: 'primary' }, slots);
    },
    Radio,
    RadioGroup,
    RangePicker,
    Rate,
    Select: withDefaultPlaceholder(Select, 'select'),
    Space,
    Switch,
    Textarea: withDefaultPlaceholder(Textarea, 'input'),
    TimePicker,
    TreeSelect: withDefaultPlaceholder(TreeSelect, 'select'),
    Upload,
  };

  // 将组件注册到全局共享状态中
  globalShareState.setComponents(components);

  // 定义全局共享状态中的消息提示
  globalShareState.defineMessage({
    // 复制成功消息提示
    copyPreferencesSuccess: (title, content) => {
      notification.success({
        description: content,
        message: title,
        placement: 'bottomRight',
      });
    },
  });
}

export { initComponentAdapter };
```

:::

## 基础用法

::: tip README

下方示例代码中的，存在一些国际化、主题色未适配问题，这些问题只在文档内会出现，实际使用并不会有这些问题，可忽略，不必纠结。

:::

使用 `useVbenForm` 创建最基础的表单。

<DemoPreview dir="demos/vben-form/basic" />

## 查询表单

查询表单是一种特殊的表单，用于查询数据。查询表单不会触发表单验证，只会触发查询事件。

<DemoPreview dir="demos/vben-form/query" />

## 值格式化

当组件的展示值与后端真正需要的 payload 不一致时，可以在 schema 上使用 `valueFormat`。它会在 `getValues()`、提交、以及依赖这些输出的方法中生效。

- `return xxx`：回写当前字段
- `setValue('startTime', xxx)`：写入其他字段
- `return undefined`：保持当前字段已被移除，适合把一个字段拆成多个字段

<DemoPreview dir="demos/vben-form/value-format" />

## 表单校验

表单校验是一个非常重要的功能，可以通过 `rules` 属性进行校验。

<DemoPreview dir="demos/vben-form/rules" />

## 表单联动

表单联动是一个非常常见的功能，可以通过 `dependencies` 属性进行联动。

_注意_ 需要指定 `dependencies` 的 `triggerFields` 属性，设置由谁的改动来触发，以便表单组件能够正确的联动。

新代码推荐使用 `dependencies.resolve(context)` 一次返回完整动态状态。它只在 `triggerFields` 变化时执行，并原子更新 `if`、`show`、`disabled`、`required`、`rules`、`componentProps`、`help` 和 `renderComponentContent`，避免多个异步回调产生中间状态。原有多回调结构继续兼容。

<DemoPreview dir="demos/vben-form/dynamic" />

## 自定义组件

如果你的业务组件库没有提供某个组件，你可以自行封装一个组件，然后加到表单内部。

<DemoPreview dir="demos/vben-form/custom" />

## 操作

一些常见的表单操作。

<DemoPreview dir="demos/vben-form/api" />

## API

`useVbenForm` 返回一个数组，第一个元素是表单组件，第二个元素是表单的方法。

```vue
<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';

// Form 为弹窗组件
// formApi 为弹窗的方法
const [Form, formApi] = useVbenForm({
  // 属性
  // 事件
});
</script>

<template>
  <Form />
</template>
```

### 类型传递与插槽

通过 `useVbenForm<TValues>` 定义一次表单值类型后，`getValues`、`setValues`、`setFieldValue`、`handleSubmit`、`handleValuesChange`、`formApi.form.values` 和 selector 都会沿用该类型，可直接作为 API 请求参数：

```vue
<script setup lang="ts">
import { useVbenForm } from '#/adapter/form';

interface AccountFormValues {
  email: string;
  nickname: string;
}

const [Form, formApi] = useVbenForm<AccountFormValues>({
  handleSubmit(values, rawValues) {
    // values: AccountFormValues
    // rawValues: Readonly<AccountFormValues>
    return addAccount(values);
  },
  schema: [
    { component: 'Input', fieldName: 'email', label: 'Email' },
    { component: 'Input', fieldName: 'nickname', label: 'Nickname' },
  ],
});

async function fillForm() {
  await formApi.setValues({ email: 'user@example.com' });
  const values = await formApi.getValues(); // AccountFormValues
  return values;
}
</script>

<template>
  <Form>
    <template #email="{ componentField, field, formApi, values }">
      <!-- field.state.value、componentField.modelValue 均为 string -->
      <input v-bind="componentField" :data-email="values.email" />
      <button type="button" @click="formApi.clearValidation('email')">
        Clear
      </button>
    </template>
    <template #default="{ formApi, shapes, values }">
      <!-- values: AccountFormValues -->
      <button type="button" @click="formApi.submit()">
        Submit {{ shapes.length }} fields for {{ values.email }}
      </button>
    </template>
  </Form>
</template>
```

字段命名插槽提供 `field`、`componentField`、`modelValue`、`name`、`disabled`、`isInValid`、`values` 和 `formApi`。默认插槽提供 `shapes`、`values` 和 `formApi`；`reset-before`、`submit-before`、`expand-before`、`expand-after` 提供 `values` 和 `formApi`。未声明 `TValues` 时仍兼容任意字段名，但 slot props 会回退为宽泛类型。

### FormApi

useVbenForm 返回的第二个参数，是一个对象，包含了一些表单的方法。

| 方法名 | 描述 | 类型 | 版本号 |
| --- | --- | --- | --- |
| submit | 提交表单 | `(e?: Event) => Promise<TValues>` | - |
| validateAndSubmit | 校验通过后提交表单 | `() => Promise<TValues \| undefined>` | - |
| reset | 重置表单 | `(state?: FormResetState<TValues>, options?: FormResetOptions) => Promise<void>` | - |
| clearValidation | 清空指定字段或全部校验，并取消进行中的异步校验 | `(fieldNames?: FormFieldName<TValues> \| FormFieldName<TValues>[]) => Promise<void>` | - |
| setValues | 设置表单值，默认会过滤不在 schema 中定义的字段 | `(fields: Partial<TValues>, filterFields?: boolean, shouldValidate?: boolean) => Promise<void>` | - |
| getValues | 获取经过字段映射和 valueFormat 的值 | `() => Promise<TValues>` | - |
| getRawValues | 获取未格式化的独立值快照 | `() => Promise<TValues>` | - |
| getValueSnapshot | 一次获取原始值和格式化值 | `() => Promise<FormValueSnapshot<TValues>>` | - |
| formatValues | 格式化指定的原始值快照 | `(rawValues: Readonly<TValues>) => TValues` | - |
| validate | 表单校验 | `() => Promise<FormValidationResult>` | - |
| validateField | 校验指定字段 | `(fieldName: string) => Promise<FormValidationResult>` | - |
| isFieldValid | 检查某个字段是否已通过校验 | `(fieldName: string)=>Promise<boolean>` | - |
| updateSchema | 更新formSchema | `(schema:FormSchema[])=>void` | - |
| setFieldValue | 设置字段值 | `(field: string, value: any, shouldValidate?: boolean)=>Promise<void>` | - |
| setState | 设置组件状态（props） | `(stateOrFn:\| ((prev: VbenFormProps) => Partial<VbenFormProps>)\| Partial<VbenFormProps>)=>Promise<void>` | - |
| getState | 获取组件状态（props） | `()=>Promise<VbenFormProps>` | - |
| form | 稳定的 `FormContextApi`，提供 values、errors、set/reset/validate/submit 与数组字段操作，不暴露底层 TanStack 泛型 | `FormContextApi` | - |
| getFieldComponentRef | 获取指定字段的组件实例 | `<T=unknown>(fieldName: string)=>T` | >5.5.3 |
| getFocusedField | 获取当前已获得焦点的字段 | `()=>string\|undefined` | >5.5.3 |

旧命名 `submitForm`、`validateAndSubmitForm`、`resetForm`、`resetValidate` 分别对应 `submit`、`validateAndSubmit`、`reset`、`clearValidation`。它们仍可调用，但已标记 `@deprecated`，开发环境每个旧名称只警告一次，生产环境静默。

### FormContextApi 响应式读取

`formApi.form` 提供细粒度 selector。字段组件应优先使用字段级方法，避免订阅整份 values 或 errors：

| 方法 | 返回值 | 用途 |
| --- | --- | --- |
| `useFieldValue(fieldName)` | `Readonly<Ref<FormFieldValue>>` | 订阅一个字段值。 |
| `useFieldValues(fieldNames)` | `Readonly<Ref<FormFieldValue[]>>` | 订阅一组声明字段值。 |
| `useFieldError(fieldName)` | `Readonly<Ref<string \| undefined>>` | 订阅一个字段错误。 |
| `useValues()` | `Readonly<Ref<TValues>>` | 订阅整份表单值。 |
| `useSelector(selector)` | `Readonly<Ref<TResult>>` | 兼容入口，可从 `{ values, errors, meta }` 组合选择状态。 |

```ts
const email = formApi.form.useFieldValue('email');
const emailError = formApi.form.useFieldError('email');
const submitting = formApi.form.useSelector((state) => state.meta.submitting);
```

## Props

所有属性都可以传入 `useVbenForm` 的第一个参数中。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| layout | 表单项布局 | `'horizontal' \| 'vertical'\| 'inline'` | `horizontal` |
| showCollapseButton | 是否显示折叠按钮 | `boolean` | `false` |
| wrapperClass | 表单的布局，基于tailwindcss | `any` | - |
| actionWrapperClass | 表单操作区域class | `any` | - |
| actionLayout | 表单操作按钮位置 | `'newLine' \| 'rowEnd' \| 'inline'` | `rowEnd` |
| actionPosition | 表单操作按钮对齐方式 | `'left' \| 'center' \| 'right'` | `right` |
| handleReset | 表单重置回调 | `(values: Record<string, any>,) => Promise<void> \| void` | - |
| handleSubmit | 表单提交回调 | `(values: TValues, rawValues: Readonly<TValues>) => Promise<void> \| void` | - |
| handleValuesChange | 表单值变化回调 | `(rawValues: Readonly<TValues>, fieldsChanged: string[], getFormattedValues: () => TValues) => void` | - |
| handleCollapsedChange | 表单收起展开状态变化回调 | `(collapsed: boolean) => void` | - |
| actionButtonsReverse | 调换操作按钮位置 | `boolean` | `false` |
| resetButtonOptions | 重置按钮组件参数 | `ActionButtonOptions` | - |
| submitButtonOptions | 提交按钮组件参数 | `ActionButtonOptions` | - |
| showDefaultActions | 是否显示默认操作按钮 | `boolean` | `true` |
| collapsed | 是否折叠，在`showCollapseButton`为`true`时生效 | `boolean` | `false` |
| collapseTriggerResize | 折叠时，触发`resize`事件 | `boolean` | `false` |
| collapsedRows | 折叠时保持的行数 | `number` | `1` |
| fieldMappingTime | 用于将表单内的数组值映射成 2 个字段 | `[string, [string, string],Nullable<string>\|[string,string]\|((any,string)=>any)?][]` | - |
| commonConfig | 表单项的通用配置，每个配置都会传递到每个表单项，表单项可覆盖 | `FormCommonConfig` | - |
| schema | 表单项的每一项配置 | `FormSchema[]` | - |
| submitOnEnter | 按下回车健时提交表单 | `boolean` | false |
| submitOnChange | 字段值改变时提交表单(内部防抖，这个属性一般用于表格的搜索表单) | `boolean` | false |
| compact | 是否紧凑模式(忽略为校验信息所预留的空间) | `boolean` | false |
| scrollToFirstError | 表单验证失败时是否自动滚动到第一个错误字段 | `boolean` | false |

::: tip handleValuesChange

`handleValuesChange` 的第一个参数是未经过 `valueFormat`、`fieldMappingTime` 或 array-to-string 转换的只读当前值，第二个参数是本次发生变化的 schema 字段名。第三个参数 `getFormattedValues` 是惰性函数：不调用就不会执行深拷贝和格式化，适合只在少数变化场景读取提交结构。字段映射生成的目标字段不会出现在 `fieldsChanged` 中。

`getRawValues()` 和 `getValues()` 分别只生成一份目标快照；确实需要同时比较两种结构时再调用 `getValueSnapshot()`。`handleSubmit(values, rawValues)` 会在提交边界同时提供格式化结果和对应的原始快照。

:::

::: tip fieldMappingTime

此属性用于将表单内的数组值映射成 2 个字段，它应当传入一个数组，数组的每一项是一个映射规则，规则的第一个成员是一个字符串，表示需要映射的字段名，第二个成员是一个数组，表示映射后的字段名，第三个成员是一个可选的格式掩码，用于格式化日期时间字段；也可以提供一个格式化函数（参数分别为当前值和当前字段名，返回格式化后的值）。如果明确地将格式掩码设为null，则原值映射而不进行格式化（适用于非日期时间字段）。例如：`[['timeRange', ['startTime', 'endTime'], 'YYYY-MM-DD']]`，`timeRange`应当是一个至少具有2个成员的数组类型的值。Form会将`timeRange`的值前两个值分别按照格式掩码`YYYY-MM-DD`格式化后映射到`startTime`和`endTime`字段上。每一项的第三个参数是一个可选的格式掩码，

:::

::: tip valueFormat

`valueFormat` 适合处理“组件值”和“提交值”不一致的场景。例如：

- `RangePicker` 返回 `[dayjs, dayjs]`，但后端需要 `{ startTime, endTime }`
- `DatePicker` 返回 `dayjs`，但后端只需要时间戳

`valueFormat` 会在 `getValues()` 过程中执行：

- 返回 `undefined`：当前字段保持删除状态
- 返回其他值：回写当前字段
- 调用 `setValue(key, nextValue)`：写入一个或多个新字段

```ts
{
  component: 'RangePicker',
  fieldName: 'reportRange',
  valueFormat(value, setValue) {
    setValue('startTime', value?.[0]?.valueOf());
    setValue('endTime', value?.[1]?.valueOf());
  },
}
```

:::

### TS 类型说明

::: details ActionButtonOptions

```ts
export interface ActionButtonOptions {
  /** 样式 */
  class?: ClassType;
  /** 是否禁用 */
  disabled?: boolean;
  /** 是否加载中 */
  loading?: boolean;
  /** 按钮大小 */
  size?: ButtonVariantSize;
  /** 按钮类型 */
  variant?: ButtonVariants;
  /** 是否显示 */
  show?: boolean;
  /** 按钮文本 */
  content?: string;
  /** 任意属性 */
  [key: string]: any;
}
```

:::

::: details FormCommonConfig

```ts
export interface FormCommonConfig {
  /**
   * 仅当组件不发送 update:*、只发送 change 时启用兼容回退
   * @default false
   */
  changeEventFallback?: boolean;
  /**
   * 所有表单项的props
   */
  componentProps?: ComponentProps;
  /**
   * 所有表单项的控件样式
   */
  controlClass?: string;
  /**
   * 在表单项的Label后显示一个冒号
   */
  colon?: boolean;
  /**
   * 所有表单项的禁用状态
   * @default false
   */
  disabled?: boolean;
  /**
   * 所有表单项的控件样式
   * @default {}
   */
  formFieldProps?: FormFieldOptions;
  /**
   * 所有表单项的栅格布局
   * @default ""
   */
  formItemClass?: (() => string) | string;
  /**
   * 隐藏所有表单项label
   * @default false
   */
  hideLabel?: boolean;
  /**
   * 是否隐藏必填标记
   * @default false
   */
  hideRequiredMark?: boolean;
  /**
   * 所有表单项的label样式
   * @default ""
   */
  labelClass?: string;
  /**
   * 所有表单项的label宽度
   */
  labelWidth?: number;
  /**
   * 所有表单项的model属性名。使用自定义组件时可通过此配置指定组件的model属性名。已经在modelPropNameMap中注册的组件不受此配置影响
   * @default "modelValue"
   */
  modelPropName?: string;
  /**
   * 所有表单项的wrapper样式
   */
  wrapperClass?: string;
}
```

:::

::: details FormSchema

```ts
export interface FormSchema<
  T extends BaseFormComponentType = BaseFormComponentType,
  TValues extends FormValues = FormValues,
> extends FormCommonConfig {
  /** 组件 */
  component: Component | T;
  /** 组件参数 */
  componentProps?:
    | MaybeComponentProps
    | ((ctx: FormSchemaContext<TValues>) => MaybeComponentProps);
  /** 默认值 */
  defaultValue?: any;
  /** 依赖 */
  dependencies?: FormItemDependencies;
  /** 描述 */
  description?: string;
  /** 字段名，也作为自定义插槽的名称 */
  fieldName: string;
  /** 帮助信息 */
  help?: string | ((ctx: FormSchemaContext<TValues>) => Component | string);
  /** 是否隐藏表单项 */
  hide?: boolean;
  /** 表单的标签（如果是一个string，会用于默认必选规则的消息提示） */
  label?: CustomRenderType;
  /** 自定义组件内部渲染  */
  renderComponentContent?: (
    ctx: FormSchemaContext<TValues>,
  ) => Record<string, any>;
  /** 字段规则 */
  rules?: FormSchemaRuleType;
  /** 后缀 */
  suffix?: CustomRenderType;
  /** 获取 getValues() 输出时格式化当前字段 */
  valueFormat?: FormValueFormat;
}
```

顶层 `componentProps`、`help` 和 `renderComponentContent` 函数只接收轻量 `FormSchemaContext`，适合数组行索引、字段路径等 schema 信息。需要读取表单值时，使用 `dependencies.resolve({ values, ... })`，避免每个字段订阅整份 values。

:::

::: details FormValueFormat

```ts
type FormValueFormat = (
  value: any,
  setValue: (fieldName: string, value: any) => void,
  values: Record<string, any>,
) => any;
```

- 返回 `undefined`：保持当前字段已被移除
- 返回其他值：将当前字段恢复/写回为该值
- `setValue(fieldName, value)`：用于把一个字段拆分写入其他字段

:::

### 表单联动

表单联动需要通过 schema 内的 `dependencies` 属性进行联动，允许您添加字段之间的依赖项，以根据其他字段的值控制字段。

```ts
dependencies: {
  triggerFields: ['type', 'role'],
  resolve({ values, actions, controller, schema }) {
    const editable = values.type === 'editable';
    return {
      componentProps: { placeholder: schema.fieldName },
      disabled: !editable,
      required: values.role === 'owner',
      rules: editable ? 'required' : null,
      show: values.type !== 'hidden',
    };
  },
}
```

`resolve` 返回的字段会一次性提交；支持 `if`、`show`、`disabled`、`required`、`rules`、`componentProps`、`help` 和 `renderComponentContent`。未返回 `rules` 时继续使用静态规则，显式返回 `rules: null` 时关闭静态规则。`actions` 是稳定的 `FormContextApi`，`controller` 是高层 FormApi，`schema` 包含字段名和数组行上下文。

旧的 `if/show/disabled/required/rules/componentProps/trigger` 回调语法仍完整兼容并保持原求值顺序，但已标记为 `@deprecated`，开发环境首次使用时会提示迁移。新旧语法在同一个 dependencies 对象中互斥；绕过类型同时传入时以 `resolve` 为准。

### 表单校验

表单校验需要通过 schema 内的 `rules` 属性进行配置。

字段默认在 blur、change 和 submit 时校验。使用 `formFieldProps.validateOn` 限制交互触发时机，submit 始终校验；异步校验可通过 `asyncDebounceMs` 防抖：

```ts
formFieldProps: {
  asyncDebounceMs: 300,
  validateOn: ['blur'],
}
```

rules的值可以是字符串（预定义的校验规则名称），也可以是一个zod的schema。

#### 预定义的校验规则

```ts
// 表示字段必填，默认会根据适配器的required进行国际化
{
  rules: 'required';
}

// 表示字段必填，默认会根据适配器的required进行国际化，用于下拉选择之类
{
  rules: 'selectRequired';
}
```

#### zod

rules也支持 zod 的 schema，可以进行更复杂的校验，zod 的使用请查看 [zod文档](https://zod.dev/)。

```ts
import { z } from '#/adapter/form';

// 基础类型
{
  rules: z.string().min(1, { message: '请输入字符串' });
}

// 可选(可以是undefined)，并且携带默认值。注意zod的optional不包括空字符串''
{
  rules: z.string().default('默认值').optional();
}

// 可以是空字符串、undefined或者一个邮箱地址(两种不同的用法)
{
  rules: z.union([z.string().email().optional(), z.literal('')]);
}

{
  rules: z.string().email().or(z.literal('')).optional();
}

// 复杂校验
{
  z.string()
    .min(1, { message: '请输入' })
    .refine((value) => value === '123', {
      message: '值必须为123',
    });
}
```

## Slots

可以使用以下插槽在表单中插入自定义的内容

| 插槽名        | 描述               |
| ------------- | ------------------ |
| reset-before  | 重置按钮之前的位置 |
| submit-before | 提交按钮之前的位置 |
| expand-before | 展开按钮之前的位置 |
| expand-after  | 展开按钮之后的位置 |

::: tip 字段插槽

除了以上内置插槽之外，`schema`属性中每个字段的`fieldName`都可以作为插槽名称，这些字段插槽的优先级高于`component`定义的组件。也就是说，当提供了与`fieldName`同名的插槽时，这些插槽的内容将会作为这些字段的组件，此时`component`的值将会被忽略。

:::
