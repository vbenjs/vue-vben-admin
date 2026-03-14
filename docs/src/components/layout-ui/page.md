---
outline: deep
---

# Page 常规页面组件

`Page` 是页面内容区最常用的顶层布局容器，内置了标题区、内容区和底部区三部分结构。

::: info 写在前面

这是一个基础页面容器。如果你的业务页面需要更复杂的布局，例如双列、侧边操作区或自定义滚动区域，建议在 `Page` 之上继续封装。:::

## 基础用法

直接将 `Page` 作为业务页面的根组件使用即可。

### Props

| 属性名 | 描述 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- | --- |
| title | 页面标题 | `string \| slot` | - | - |
| description | 页面描述 | `string \| slot` | - | - |
| contentClass | 内容区域的 class | `string` | - | - |
| headerClass | 头部区域的 class | `string` | - | - |
| footerClass | 底部区域的 class | `string` | - | - |
| autoContentHeight | 根据可视内容高度自动计算内容区高度 | `boolean` | `false` | 开启后内容区会根据布局可视高度自动扣减头部和底部高度 |
| heightOffset | 额外扣减的内容区高度偏移量 | `number` | `0` | 仅在 `autoContentHeight` 开启时生效，单位为 `px` |

::: tip 注意

如果 `title`、`description`、`extra` 三者都没有提供有效内容，无论是通过 `props` 还是 `slots`，头部区域都不会渲染。:::

### Slots

| 插槽名称    | 描述             |
| ----------- | ---------------- |
| default     | 页面内容         |
| title       | 页面标题         |
| description | 页面描述         |
| extra       | 页面头部右侧内容 |
| footer      | 页面底部内容     |
