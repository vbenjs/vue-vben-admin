import { promises as fs } from 'node:fs';
import { join, normalize } from 'node:path';

const rootDir = process.cwd();

/**
 * 递归查找并删除目标目录
 * @param {string} currentDir - 当前遍历的目录路径
 * @param {string[]} targets - 要删除的目标列表
 */
async function cleanTargetsRecursively(currentDir, targets) {
  const items = await fs.readdir(currentDir);

  for (const item of items) {
    try {
      const itemPath = normalize(join(currentDir, item));
      const stat = await fs.lstat(itemPath);

      if (targets.includes(item)) {
        // 匹配到目标目录或文件时直接删除
        await fs.rm(itemPath, { force: true, recursive: true });
        console.log(`Deleted: ${itemPath}`);
      } else if (stat.isDirectory()) {
        // 只对目录进行递归处理
        await cleanTargetsRecursively(itemPath, targets);
      }
    } catch (error) {
      console.error(
        `Error handling item ${item} in ${currentDir}: ${error.message}`,
      );
    }
  }
}

(async function startCleanup() {
  // 要删除的目录及文件名称
  const targets = ['node_modules', 'dist', '.turbo', 'dist.zip'];
  const deleteLockFile = process.argv.includes('--del-lock');
  const cleanupTargets = [...targets];

  if (deleteLockFile) {
    cleanupTargets.push('pnpm-lock.yaml');
  }

  console.log(
    `Starting cleanup of targets: ${cleanupTargets.join(', ')} from root: ${rootDir}`,
  );

  try {
    await cleanTargetsRecursively(rootDir, cleanupTargets);
    console.log('Cleanup process completed successfully.');
  } catch (error) {
    console.error(`Unexpected error during cleanup: ${error.message}`);
    process.exit(1);
  }
})();
