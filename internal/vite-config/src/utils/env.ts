import type { ApplicationPluginOptions } from '../typing';

import { join } from 'node:path';

import { fs } from '@vben/node-utils';

import dotenv from 'dotenv';

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script as string;
  const reg = /--mode ([\d_a-z]+)/;
  const result = reg.exec(script);
  if (result) {
    const mode = result[1];
    return ['.env', `.env.${mode}`];
  }
  return ['.env', '.env.production'];
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
async function loadEnv<T = Record<string, string>>(
  match = 'VITE_GLOB_',
  confFiles = getConfFiles(),
) {
  let envConfig = {};

  for (const confFile of confFiles) {
    try {
      const envPath = await fs.readFile(join(process.cwd(), confFile), {
        encoding: 'utf8',
      });
      const env = dotenv.parse(envPath);
      envConfig = { ...envConfig, ...env };
    } catch (error) {
      console.error(`Error while parsing ${confFile}`, error);
    }
  }
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig as T;
}

async function loadAndConvertEnv(
  match = 'VITE_',
  confFiles = getConfFiles(),
): Promise<
  { appTitle: string; port: number } & Partial<ApplicationPluginOptions>
> {
  const envConfig = await loadEnv(match, confFiles);
  const visualizer = envConfig.visualizer || '';
  const pwa = envConfig.pwa || '';
  const compress = envConfig.VITE_COMPRESS || '';
  const compressTypes = compress
    .split(',')
    .filter((item) => item === 'brotli' || item === 'gzip');
  return {
    appTitle: envConfig?.VITE_GLOB_APP_TITLE ?? 'Vben Admin',
    compress: !!compress,
    compressTypes: compressTypes as ('brotli' | 'gzip')[],
    port: Number(envConfig.VITE_PORT) || 5173,
    pwa: !!pwa,
    visualizer: !!visualizer,
  };
}

export { loadAndConvertEnv, loadEnv };
