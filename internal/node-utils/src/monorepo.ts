import type { Package } from '@manypkg/get-packages';

import { existsSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

import * as manypkg from '@manypkg/get-packages';
const { getPackages: getPackagesFunc, getPackagesSync: getPackagesSyncFunc } =
  manypkg;

/**
 * 查找大仓的根目录
 * @param cwd
 */
function findMonorepoRoot(cwd: string = process.cwd()) {
  let currentDir = resolve(cwd);

  while (true) {
    if (existsSync(join(currentDir, 'pnpm-lock.yaml'))) {
      return currentDir;
    }

    const parentDir = dirname(currentDir);
    if (parentDir === currentDir) {
      return '';
    }

    currentDir = parentDir;
  }
}

/**
 * 获取大仓的所有包
 */
function getPackagesSync() {
  const root = findMonorepoRoot();
  return getPackagesSyncFunc(root);
}

/**
 * 获取大仓的所有包
 */
async function getPackages() {
  const root = findMonorepoRoot();

  return await getPackagesFunc(root);
}

/**
 * 获取大仓指定的包
 */
async function getPackage(pkgName: string) {
  const { packages } = await getPackages();
  return packages.find((pkg: Package) => pkg.packageJson.name === pkgName);
}

export { findMonorepoRoot, getPackage, getPackages, getPackagesSync };
