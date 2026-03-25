# ECharts Plugin

ECharts 图表插件，预置常用组件和图表类型。

## 导出

| 导出         | 类型 | 说明         |
| ------------ | ---- | ------------ |
| `default`    | 对象 | echarts 实例 |
| `EchartsUI`  | 组件 | 图表容器组件 |
| `ECOption`   | 类型 | 图表配置类型 |
| `useEcharts` | 函数 | 组合式函数   |

## 使用

```ts
import { EchartsUI, useEcharts, ECOption } from '@vben/plugins/echarts';
```

## 类型

```ts
import type { ECOption } from '@vben/plugins/echarts';
```

## 预置组件

- TitleComponent
- TooltipComponent
- GridComponent
- LegendComponent
- ToolboxComponent
- DatasetComponent
- TransformComponent

## 预置图表

- BarChart
- LineChart
- PieChart
- RadarChart
