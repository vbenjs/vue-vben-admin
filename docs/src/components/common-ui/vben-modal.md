---
outline: deep
---

# vben-modal

::: tip

文档还在完善中，敬请期待。

:::

框架提供的模态框组件，支持`拖拽`、`全屏`、`自定义`等功能。

## 基础用法

使用 `useVbenModal` 创建最基于的模态框。

<DemoPreview dir="demos/vben-modal/basic" />

## 组件抽离

modal 内的内容一般业务中，会比较复杂，所以我们可以将 modal 内的内容抽离出来。

<DemoPreview dir="demos/vben-modal/extra" />

## API

### 属性

| 属性名 | 描述  | 类型     | 默认值 |
| ------ | ----- | -------- | ------ |
| title  | 标题. | `string` | —      |

### 事件

| 事件名 | 描述 | 类型 |
| ------ | ---- | ---- |
| TODO   | TODO | TODO |

### 插槽

| 插槽名  | 描述 |
| ------- | ---- |
| default | xx.  |
