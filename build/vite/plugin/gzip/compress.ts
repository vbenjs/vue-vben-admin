import { gzip } from 'zlib';
import { readFileSync, writeFileSync } from 'fs';
import { GzipPluginOptions } from './types';
import viteConfig from '../../../../vite.config';
import { readAllFile, getCwdPath, isBuildGzip, isSiteMode } from '../../../utils';

export function startGzip(
  fileContent: string | Buffer,
  options: GzipPluginOptions = {}
): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    gzip(fileContent, options.gzipOptions || {}, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

// 手动压缩css
export async function startGzipStyle() {
  if (isBuildGzip() || isSiteMode()) {
    const outDir = viteConfig.outDir || 'dist';
    const assets = viteConfig.assetsDir || '_assets';
    const allCssFile = readAllFile(getCwdPath(outDir, assets), /\.(css)$/);
    for (const path of allCssFile) {
      const source = readFileSync(path);
      const content = await startGzip(source);
      const ds = path.split('/');
      const fileName = ds[ds.length - 1];
      writeFileSync(getCwdPath(outDir, assets, `${fileName}.gz`), content);
    }
  }
}
