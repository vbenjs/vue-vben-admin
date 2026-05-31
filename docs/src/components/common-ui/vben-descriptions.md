---
outline: deep
---

# Vben Descriptions 描述列表

`Descriptions` 用于成组展示只读的字段信息，常用于详情页、信息预览等场景。组件基于 shadcn-ui 构建，API 参考 Ant Design Vue 的 Descriptions，支持响应式列数、跨列、边框、垂直布局等能力。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例一起查看。

::: info 写在前面

组件提供两种使用方式：通过 `items` 数据驱动（推荐），或通过子组件 `VbenDescriptionsItem` 声明列表项。两者可按需选择，`items` 优先级更高。:::

## 基础用法

通过 `items` 传入字段数组，每项包含 `label` 与 `content`。默认按断点自适应列数（`xs` 1 列、`sm` 2 列、`md` 及以上 3 列）。

<DemoPreview dir="demos/vben-descriptions/basic" />

## 带边框

设置 `bordered` 展示边框样式，配合 `title` 标题与 `#extra` 插槽（位于标题右侧的操作区域）。

<DemoPreview dir="demos/vben-descriptions/bordered" />

## 垂直布局

通过 `layout="vertical"` 让标签位于内容上方。

<DemoPreview dir="demos/vben-descriptions/vertical" />

## 不同尺寸

通过 `size` 设置 `small`、`middle`、`large` 三种尺寸。

<DemoPreview dir="demos/vben-descriptions/size" />

## 跨列与响应式

单项通过 `span` 设置跨列数，`'filled'` 表示占满当前行剩余空间；`column` 支持传入按断点配置的对象实现响应式列数。

<DemoPreview dir="demos/vben-descriptions/span" />

## 子组件用法

不传 `items` 时，可在默认插槽中使用 `VbenDescriptionsItem` 声明列表项，内容支持默认插槽或 `#content` 插槽自定义。

<DemoPreview dir="demos/vben-descriptions/custom" />

## API

### Descriptions Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| items | 数据驱动的列表项；不传则读取默认插槽 | `DescriptionsItemType[]` | - |
| bordered | 是否展示边框 | `boolean` | `false` |
| column | 一行的列数，支持按断点配置 | `number \| Partial<Record<Breakpoint, number>>` | `{ xs: 1, sm: 2, md: 3, xxxl: 4 }` |
| layout | 布局方式 | `'horizontal' \| 'vertical'` | `'horizontal'` |
| size | 尺寸 | `'small' \| 'middle' \| 'large'` | `'middle'` |
| colon | 是否显示冒号（仅非边框的水平布局生效） | `boolean` | `true` |
| title | 标题 | `string` | - |
| extra | 标题右侧的操作区域 | `string` | - |
| labelStyle | 统一的标签样式 | `CSSProperties` | - |
| contentStyle | 统一的内容样式 | `CSSProperties` | - |
| class | 根节点自定义类名 | `string` | - |

### Descriptions Slots

| 插槽名  | 描述                               |
| ------- | ---------------------------------- |
| title   | 自定义标题                         |
| extra   | 自定义标题右侧操作区域             |
| default | 放置 `VbenDescriptionsItem` 子组件 |

### DescriptionsItem

`items` 数组中的每一项，或子组件 `VbenDescriptionsItem` 的属性。

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| label | 标签 | `string \| number \| (() => VNode) \| Component` | - |
| content | 内容 | `string \| number \| (() => VNode) \| Component` | - |
| span | 跨列数，`'filled'` 占满当前行剩余 | `number \| 'filled' \| Partial<Record<Breakpoint, number>>` | `1` |
| labelStyle | 标签样式 | `CSSProperties` | - |
| contentStyle | 内容样式 | `CSSProperties` | - |
| key | 唯一标识 | `string \| number` | - |

### DescriptionsItem Slots

仅子组件用法可用。

| 插槽名  | 描述                     |
| ------- | ------------------------ |
| default | 内容（等价于 `content`） |
| content | 自定义内容               |
| label   | 自定义标签               |

::: tip Breakpoint

响应式断点 `Breakpoint` 取值为 `'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'`，断点像素与 Ant Design 一致（`sm` 576、`md` 768、`lg` 992、`xl` 1200、`xxl` 1600、`xxxl` 2000）。:::
