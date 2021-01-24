import gzipPlugin from 'rollup-plugin-gzip';
import { isBuildGzip } from '../../utils';
import { Plugin } from 'vite';
export function configGzipPlugin(isBuild: boolean): Plugin | Plugin[] {
  const useGzip = isBuild && isBuildGzip();

  if (useGzip) {
    return gzipPlugin();
  }

  return [];
}
