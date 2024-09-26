import { promises as fs } from 'node:fs';
import { join } from 'node:path';

const rootDir = process.cwd();
// 要删除的目录及文件名称
const targets = ['node_modules', 'dist', '.turbo', 'dist.zip'];

/**
 * 递归查找并删除目标目录
 * @param {string} currentDir - 当前遍历的目录路径
 */
async function cleanTargetsRecursively(currentDir, deletaLockFile) {
  const items = await fs.readdir(currentDir);
  if (deletaLockFile) {
    targets.push('pnpm-lock.yaml');
  }
  for (const item of items) {
    try {
      const itemPath = join(currentDir, item);
      if (targets.includes(item)) {
        // 匹配到目标目录或文件时直接删除
        await fs.rm(itemPath, { recursive: true, force: true });
        console.log(`Deleted: ${itemPath}`);
      }
      const stat = await fs.lstat(itemPath);
      if (stat.isDirectory()) {
        await cleanTargetsRecursively(itemPath);
      }
    } catch (error) {
      // console.error(`Error handling directory ${currentDir}: ${error.message}`);
    }
  }
}

(async function startCleanup() {
  console.log(
    `Starting cleanup of targets: ${targets.join(', ')} from root: ${rootDir}`,
  );

  const deletaLockFile = process.argv.includes('--del-lock');
  try {
    await cleanTargetsRecursively(rootDir, deletaLockFile);
    console.log('Cleanup process completed.');
  } catch (error) {
    console.error(`Unexpected error during cleanup: ${error.message}`);
  }
})();
