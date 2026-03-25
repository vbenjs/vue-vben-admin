import type {
  BarSeriesOption,
  LineSeriesOption,
  PieSeriesOption,
  RadarSeriesOption,
} from 'echarts/charts';
import type {
  DatasetComponentOption,
  GridComponentOption,
  LegendComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
  ToolboxComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

export type ECOption = ComposeOption<
  | BarSeriesOption
  | DatasetComponentOption
  | GridComponentOption
  | LegendComponentOption
  | LineSeriesOption
  | PieSeriesOption
  | RadarSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
  | ToolboxComponentOption
>;
