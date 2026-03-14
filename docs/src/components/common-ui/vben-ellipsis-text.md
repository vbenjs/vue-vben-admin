---
outline: deep
---

# Vben EllipsisText 省略文本

`EllipsisText` 用于展示超长文本，支持省略、Tooltip 提示以及点击展开收起。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例一起查看。

## 基础用法

通过默认插槽提供文本内容，`maxWidth` 用于限制文本区域宽度。

<DemoPreview dir="demos/vben-ellipsis-text/line" />

## 可折叠文本

通过 `line` 设置折叠后的最大行数，通过 `expand` 开启点击展开与收起。

<DemoPreview dir="demos/vben-ellipsis-text/expand" />

## 自定义提示浮层

通过 `tooltip` 插槽自定义提示内容。

<DemoPreview dir="demos/vben-ellipsis-text/tooltip" />

## 仅在省略时显示 Tooltip

通过 `tooltip-when-ellipsis` 控制仅在文本被截断时显示 Tooltip。

<DemoPreview dir="demos/vben-ellipsis-text/auto-display" />

## API

### Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| expand | 是否支持点击展开或收起 | `boolean` | `false` |
| line | 文本最大显示行数 | `number` | `1` |
| maxWidth | 文本区域最大宽度 | `number \| string` | `'100%'` |
| placement | 提示浮层位置 | `'bottom' \| 'left' \| 'right' \| 'top'` | `'top'` |
| tooltip | 是否启用文本提示 | `boolean` | `true` |
| tooltipWhenEllipsis | 是否仅在文本被截断时显示提示 | `boolean` | `false` |
| ellipsisThreshold | 文本截断检测阈值，值越大判定越严格 | `number` | `3` |
| tooltipBackgroundColor | 提示背景色 | `string` | `''` |
| tooltipColor | 提示文字颜色 | `string` | `''` |
| tooltipFontSize | 提示文字大小，单位 `px` | `number` | `14` |
| tooltipMaxWidth | 提示内容最大宽度，单位 `px` | `number` | - |
| tooltipOverlayStyle | 提示内容区域样式 | `CSSProperties` | `{ textAlign: 'justify' }` |

### Events

| 事件名       | 描述               | 类型                          |
| ------------ | ------------------ | ----------------------------- |
| expandChange | 展开状态变化时触发 | `(isExpand: boolean) => void` |

### Slots

| 插槽名  | 描述                               |
| ------- | ---------------------------------- |
| tooltip | 开启文本提示时，用于自定义提示内容 |
