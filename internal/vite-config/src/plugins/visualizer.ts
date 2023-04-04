/**
 * Package file volume analysis
 */
import { type PluginOption } from 'vite';
import visualizer from 'rollup-plugin-visualizer';

export function configVisualizerConfig() {
  return visualizer({
    filename: './node_modules/.cache/visualizer/stats.html',
    open: true,
    gzipSize: true,
    brotliSize: true,
  }) as PluginOption;
}
