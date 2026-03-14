---
outline: deep
---

# Vben CountToAnimator 数字动画

`CountToAnimator` 用于展示数字滚动动画效果。

> 如果文档内没有覆盖到你需要的细节，可以结合在线示例一起查看。

::: info 写在前面

这是一个轻量数字动画组件。如果你需要完全不同的过渡控制方式，也可以直接使用原生动画方案或自行封装。:::

## 基础用法

通过 `start-val` 和 `end-val` 设置数字动画的起始值和结束值，配合 `duration` 控制动画时长。

<DemoPreview dir="demos/vben-count-to-animator/basic" />

## 自定义前缀与分隔符

通过 `prefix`、`suffix`、`separator` 和 `decimal` 可以控制展示格式。

<DemoPreview dir="demos/vben-count-to-animator/custom" />

### Props

| 属性名 | 描述 | 类型 | 默认值 |
| --- | --- | --- | --- |
| startVal | 起始值 | `number` | `0` |
| endVal | 结束值 | `number` | `2021` |
| duration | 动画持续时间 | `number` | `1500` |
| autoplay | 是否自动播放 | `boolean` | `true` |
| prefix | 前缀 | `string` | `''` |
| suffix | 后缀 | `string` | `''` |
| separator | 千分位分隔符 | `string` | `','` |
| decimal | 小数点分隔符 | `string` | `'.'` |
| color | 文本颜色 | `string` | `''` |
| useEasing | 是否启用过渡预设 | `boolean` | `true` |
| transition | 过渡预设名称 | `keyof typeof TransitionPresets` | `'linear'` |
| decimals | 保留小数位数 | `number` | `0` |

### Events

| 事件名         | 描述                          | 类型             |
| -------------- | ----------------------------- | ---------------- |
| started        | 动画开始时触发                | `() => void`     |
| finished       | 动画结束时触发                | `() => void`     |
| ~~onStarted~~  | ~~已废弃，请改用 `started`~~  | ~~`() => void`~~ |
| ~~onFinished~~ | ~~已废弃，请改用 `finished`~~ | ~~`() => void`~~ |

### Methods

| 方法名 | 描述                             | 类型         |
| ------ | -------------------------------- | ------------ |
| reset  | 重置为 `startVal` 并重新执行动画 | `() => void` |
