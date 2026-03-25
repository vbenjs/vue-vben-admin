import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts';
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  ToolboxComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import {
  LabelLayout,
  LegacyGridContainLabel,
  UniversalTransition,
} from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  PieChart,
  RadarChart,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  LineChart,
  LabelLayout,
  LegacyGridContainLabel,
  UniversalTransition,
  CanvasRenderer,
  LegendComponent,
  ToolboxComponent,
]);
export type { ECOption } from './types';

export default echarts;
