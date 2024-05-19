import fs from 'node:fs';
import { dirname, extname, resolve } from 'node:path';

import { findUpSync } from 'find-up';

/**
 * 查找 package.json 文件所在的目录
 * @param pathname
 */
function findUpPackageDir(pathname: string = '') {
  const file = findUpSync('package.json', {
    cwd: dirname(pathname),
    type: 'file',
  });
  return dirname(file || '');
}

/**
 * 根据给定的扩展名数组来查找文件是否存在，并返回对应文件路径
 * @param pathname 文件路径
 * @param extensions 扩展名数组
 * @returns 对应文件路径，如果未找到则返回 null
 */
function findFileByExtension(
  pathname: string = '',
  extensions: string[] = ['.ts'],
): string {
  if (extname(pathname)) {
    return pathname;
  }

  for (const ext of extensions) {
    const fullpath = resolve(pathname);
    if (fs.existsSync(fullpath + ext) && fs.statSync(fullpath + ext).isFile()) {
      return fullpath + ext;
    }
  }

  for (const ext of extensions) {
    const resultPath = resolve(pathname, `index${ext}`);
    if (fs.existsSync(resultPath)) {
      return resultPath;
    }
  }
  return pathname;
}

export { findFileByExtension, findUpPackageDir };
