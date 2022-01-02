/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 * @see https://github.com/anncwb/vite-plugin-compression
 */
import type { Plugin } from 'vite'

import compressPlugin from 'vite-plugin-compression'

export const configCompressPlugin = (
  compress: 'gzip' | 'brotli' | 'none',
  deleteOriginFile = false,
): Plugin | Plugin[] => {
  const compressList = compress.split(',')

  const plugins: Plugin[] = []

  if (compressList.includes('gzip')) {
    plugins.push(compressPlugin({ deleteOriginFile }))
  }

  if (compressList.includes('brotli')) {
    plugins.push(
      compressPlugin({
        algorithm: 'brotliCompress',
        deleteOriginFile,
      }),
    )
  }
  return plugins
}
