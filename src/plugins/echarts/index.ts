import * as echarts from 'echarts/core';

import { BarChart, LineChart, PieChart, MapChart, PictorialBarChart } from 'echarts/charts';

import {
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
} from 'echarts/components';

import { SVGRenderer } from 'echarts/renderers';

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  PolarComponent,
  AriaComponent,
  ParallelComponent,
  BarChart,
  LineChart,
  PieChart,
  MapChart,
  SVGRenderer,
  PictorialBarChart,
]);

export default echarts;
