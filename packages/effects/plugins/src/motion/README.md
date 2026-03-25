# Motion Plugin

基于 @vueuse/motion 的动画插件。

## 导出

| 导出              | 类型 | 说明       |
| ----------------- | ---- | ---------- |
| `Motion`          | 组件 | 动画组件   |
| `MotionGroup`     | 组件 | 动画组组件 |
| `MotionDirective` | 指令 | 动画指令   |
| `MotionPlugin`    | 插件 | Vue 插件   |

## 使用

```ts
import { MotionPlugin, Motion, MotionDirective } from '@vben/plugins/motion';

app.use(MotionPlugin);
```

## 类型

```ts
import type { MotionOptions, MotionVariants } from '@vben/plugins/motion';
```
