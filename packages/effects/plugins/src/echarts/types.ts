import type { BarSeriesOption, LineSeriesOption } from 'echarts/charts';
import type {
  DatasetComponentOption,
  GridComponentOption,
  TitleComponentOption,
  TooltipComponentOption,
} from 'echarts/components';
import type { ComposeOption } from 'echarts/core';

export type ECOption = ComposeOption<
  | BarSeriesOption
  | DatasetComponentOption
  | GridComponentOption
  | LineSeriesOption
  | TitleComponentOption
  | TooltipComponentOption
>;
