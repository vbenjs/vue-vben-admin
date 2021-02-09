/**
 * Used to package and output gzip. Note that this does not work properly in Vite, the specific reason is still being investigated
 */
import type { Plugin } from 'vite';

import gzipPlugin from 'rollup-plugin-gzip';
import { isBuildGzip } from '../../utils';

export function configGzipPlugin(isBuild: boolean): Plugin | Plugin[] {
  const useGzip = isBuild && isBuildGzip();

  if (useGzip) {
    return gzipPlugin();
  }

  return [];
}
