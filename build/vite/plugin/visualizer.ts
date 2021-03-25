/**
 * Package file volume analysis
 */
import visualizer from 'rollup-plugin-visualizer';
import { isReportMode } from '../../utils';

export function configVisualizerConfig() {
  if (isReportMode()) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      // @ts-ignore
      gzipSize: true,
      // @ts-ignore
      brotliSize: true,
    }) as Plugin;
  }
  return [];
}
