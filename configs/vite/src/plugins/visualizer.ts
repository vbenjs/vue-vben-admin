/**
 * Package file volume analysis
 * @see https://github.com/btd/rollup-plugin-visualizer
 */
import type { PluginOption } from 'vite'
import visualizer from 'rollup-plugin-visualizer'

export function configVisualizerConfig(): PluginOption {
  if (process.env.REPORT === 'true') {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    })
  }
}
