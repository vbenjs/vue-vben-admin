import type { PluginOption } from 'vite';

import type { ArchiverPluginOptions } from '../typing';

import fs from 'node:fs';
import fsp from 'node:fs/promises';
import { join } from 'node:path';

import { ZipArchive } from 'archiver';

export const viteArchiverPlugin = (
  options: ArchiverPluginOptions = {},
): PluginOption => {
  return {
    apply: 'build',
    closeBundle: {
      handler() {
        const { name = 'dist', outputDir = '.' } = options;

        // 保持原 setTimeout 延迟语义（等产物写入落盘后再打包），但把结果
        // 交回 closeBundle：打包失败时以 Promise 拒绝回传，让 Vite 构建
        // 失败并带出错误，而不是 console.error 吞掉后静默产出不完整的 zip。
        return new Promise<void>((resolve, reject) => {
          setTimeout(async () => {
            const folderToZip = 'dist';

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
              reject(error);
            }
          }, 0);
        });
      },
      order: 'post',
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
