import type { Package } from '@manypkg/get-packages';

import { dirname } from 'node:path';

import * as manypkg from '@manypkg/get-packages';
import * as findUp from 'find-up';

const { getPackages: getPackagesFunc, getPackagesSync: getPackagesSyncFunc } =
  manypkg;
const { findUpSync } = findUp;

/**
 * 查找大仓的根目录
 * @param cwd
 */
function findMonorepoRoot(cwd: string = process.cwd()) {
  const lockFile = findUpSync('pnpm-lock.yaml', {
    cwd,
    type: 'file',
  });
  return dirname(lockFile || '');
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
