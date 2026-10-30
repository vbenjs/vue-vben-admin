import type { PluginOption } from 'vite';

import type { ArchiverPluginOptions } from '../typing';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join, resolve } from 'node:path';

import { ZipArchive } from 'archiver';

export const viteArchiverPlugin = (
  options: ArchiverPluginOptions = {},
): PluginOption => {
  // vite build --watch 下，BUNDLE_END 事件里对 bundle.close() 的调用既不
  // await 也不 catch（vite 8.3 build.ts），closeBundle 的拒绝会变成
  // unhandled rejection 直接杀死 watcher；记录 watch 状态以便降级处理。
  let isWatchMode = false;
  // 记录产物目录（以 config.root 为基准解析出的绝对路径）。硬编码 dist
  // 或按 cwd 解析相对 outDir，都会在自定义 build.outDir 或 root ≠ cwd 时
  // 打包错误目录：目录缺失时产出空 zip，存在时产出过期 zip。
  let folderToZip = 'dist';

  return {
    apply: 'build',
    closeBundle: {
      handler() {
        const { name = 'dist', outputDir = '.' } = options;

        // 保持原 setTimeout 延迟语义（等产物写入落盘后再打包），但把结果
        // 交回 closeBundle：一次性构建时打包失败以 Promise 拒绝回传，让
        // Vite 构建失败并带出错误，而不是 console.error 吞掉后静默产出
        // 不完整的 zip。
        return new Promise<void>((resolve, reject) => {
          setTimeout(async () => {
            const zipOutputDir = join(process.cwd(), outputDir);
            const zipOutputPath = join(zipOutputDir, `${name}.zip`);
            try {
              await fsp.mkdir(zipOutputDir, { recursive: true });
            } catch {
              // ignore
            }

            try {
              await zipFolder(folderToZip, zipOutputPath);
              console.log(`Folder has been zipped to: ${zipOutputPath}`);
              resolve();
            } catch (error) {
              if (isWatchMode) {
                // watch 下拒绝无人兜底（见上），降级为日志保住 watcher，
                // 下次重建会重新尝试打包。
                console.error('Error zipping folder:', error);
                resolve();
              } else {
                reject(error);
              }
            }
          }, 0);
        });
      },
      order: 'post',
    },
    configResolved(config) {
      isWatchMode = !!config.build.watch;
      // resolved config 里 build.outDir 保持用户配置原样（可能是相对路
      // 径，实测 vite 8.2/8.3 均如此），Vite 内部按 config.root 解析，
      // 这里同样以 root 为基准，不能落到 cwd 上。
      folderToZip = resolve(config.root, config.build.outDir || 'dist');
    },
    enforce: 'post',
    name: 'vite:archiver',
  };
};

async function zipFolder(
  folderPath: string,
  outputPath: string,
): Promise<void> {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);

    const archive = new ZipArchive({
      zlib: { level: 9 }, // 设置压缩级别为 9 以实现最高压缩率
    });

    output.on('close', () => {
      console.log(
        `ZIP file created: ${outputPath} (${archive.pointer()} total bytes)`,
      );
      resolve();
    });

    // 输出流自身出错(目标不可写 EACCES/ENOSPC、目录被替换 ENOTDIR 等)
    // 不经 archive 的 'error' 事件,无监听会以 uncaughtException 杀进程,
    // 且 'close' 永不触发——上层 closeBundle 的 Promise 会挂死。与
    // 'error' 事件重复 reject 是无害的空操作。
    output.on('error', reject);

    archive.on('error', (err) => {
      reject(err);
    });

    archive.pipe(output);

    // 使用 directory 方法以流的方式压缩文件夹，减少内存消耗
    archive.directory(folderPath, false);

    // 流式处理完成。finalize 被拒绝时不依赖 archive 的 'error' 事件
    // （未必触发），直路由 Promise 拒绝交给上层 closeBundle 的
    // try/catch 兜底；与 'error' 事件重复 reject 是无害的空操作，
    // 而悬空拒绝（void）在 Node 15+ 会直接杀死构建进程。
    archive.finalize().catch(reject);
  });
}
