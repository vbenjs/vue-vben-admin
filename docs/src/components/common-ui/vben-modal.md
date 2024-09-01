---
outline: deep
---

# Vben Modal 模态框

框架提供的模态框组件，支持`拖拽`、`全屏`、`自动高度`、`loading`等功能。

## 基础用法

使用 `useVbenModal` 创建最基础的模态框。

<DemoPreview dir="demos/vben-modal/basic" />

## 组件抽离

Modal 内的内容一般业务中，会比较复杂，所以我们可以将 modal 内的内容抽离出来，也方便复用。通过 `connectedComponent` 参数，可以将内外组件进行连接，而不用其他任何操作。

<DemoPreview dir="demos/vben-modal/extra" />

## 开启拖拽

通过 `draggable` 参数，可开启拖拽功能。

<DemoPreview dir="demos/vben-modal/draggable" />

## 自动计算高度

弹窗会自动计算内容高度，超过一定高度会出现滚动条，同时结合 `loading` 效果以及使用 `prepend-footer` 插槽。

<DemoPreview dir="demos/vben-modal/auto-height" />

## 使用 Api

通过 `modalApi` 可以调用 modal 的方法以及使用 `setState` 更新 modal 的状态。

<DemoPreview dir="demos/vben-modal/dynamic" />

## 数据共享

如果你使用了 `connectedComponent` 参数，那么内外组件会共享数据，比如一些表单回填等操作。可以用 `modalApi` 来获取数据和设置数据，配合 `onOpenChange`，可以满足大部分的需求。

<DemoPreview dir="demos/vben-modal/shared-data" />

::: info 注意

- `VbenModal` 组件对与参数的处理优先级是 `slot` > `props` > `state`(通过api更新的状态以及useVbenModal参数)。如果你已经传入了 `slot` 或者 `props`，那么 `setState` 将不会生效，这种情况下你可以通过 `slot` 或者 `props` 来更新状态。
- 如果你使用到了 `connectedComponent` 参数，那么会存在 2 个`useVbenModal`, 此时，如果同时设置了相同的参数，那么以内部为准（也就是没有设置 connectedComponent 的代码）。比如 同时设置了 `onComfirm`，那么以内部的 `onComfirm` 为准。`onOpenChange`事件除外，内外都会触发。

:::

## API

```ts
// Modal 为弹窗组件
// modalApi 为弹窗的方法
const [Modal, modalApi] = useVbenModal({
  // 属性
  // 事件
});
```

### Props

所有属性都可以传入 `useVbenModal` 的第一个参数中。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| title | 标题 | `string\|slot` | - |
| titleTooltip | 标题提示信息 | `string\|slot` | - |
| description | 描述信息 | `string\|slot` | - |
| isOpen | 弹窗打开状态 | `boolean` | `false` |
| loading | 弹窗加载状态 | `boolean` | `false` |
| fullscreen | 全屏显示 | `boolean` | `false` |
| fullscreenButton | 显示全屏按钮 | `boolean` | `true` |
| draggable | 可拖拽 | `boolean` | `false` |
| closable | 显示关闭按钮 | `boolean` | `true` |
| centered | 居中显示 | `boolean` | `false` |
| modal | 显示遮罩 | `boolean` | `true` |
| header | 显示header | `boolean` | `true` |
| footer | 显示footer | `boolean\|slot` | `true` |
| confirmLoading | 确认按钮loading状态 | `boolean` | `false` |
| closeOnClickModal | 点击遮罩关闭弹窗 | `boolean` | `true` |
| closeOnPressEscape | esc 关闭弹窗 | `boolean` | `true` |
| confirmText | 确认按钮文本 | `string\|slot` | `确认` |
| cancelText | 取消按钮文本 | `string\|slot` | `取消` |
| showCancelButton | 显示取消按钮 | `boolean` | `true` |
| showConfirmButton | 显示确认按钮文本 | `boolean` | `true` |
| class | modal的class，宽度通过这个配置 | `string` | - |
| contentClass | modal内容区域的class | `string` | - |
| footerClass | modal底部区域的class | `string` | - |
| headerClass | modal顶部区域的class | `string` | - |

### Event

以下事件，只有在 `useVbenModal({onCancel:()=>{}})` 中传入才会生效。

| 事件名 | 描述 | 类型 |
| --- | --- | --- |
| onBeforeClose | 关闭前触发，返回 `false`则禁止关闭 | `()=>boolean` |
| onCancel | 点击取消按钮触发 | `()=>void` |
| onConfirm | 点击确认按钮触发 | `()=>void` |
| onOpenChange | 关闭或者打开弹窗时触发 | `(isOpen:boolean)=>void` |

### Slots

除了上面的属性类型包含`slot`，还可以通过插槽来自定义弹窗的内容。

| 插槽名         | 描述                |
| -------------- | ------------------- |
| default        | 默认插槽 - 弹窗内容 |
| prepend-footer | 取消按钮左侧        |
| append-footer  | 取消按钮右侧        |

### modalApi

| 事件名 | 描述 | 类型 |
| --- | --- | --- |
| setState | 动态设置弹窗状态属性 | `setState(props) \| setState((prev)=>(props))` |
| open | 打开弹窗 | `()=>void` |
| close | 关闭弹窗 | `()=>void` |
| setData | 设置共享数据 | `<T>(data:T)=>void` |
| getData | 获取共享数据 | `<T>()=>T` |
| useStore | 获取可响应式状态 | - |
