import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { isString, isObject } from '/@/utils/is';

export function isDevFn(mode: string): boolean {
  return mode === 'development';
}

export function isProdFn(mode: string): boolean {
  return mode === 'production';
}

/**
 * Whether to generate package preview
 */
export function isReportMode(): boolean {
  return process.env.REPORT === 'true';
}

// Read all environment variable configuration files to process.env
export function wrapperEnv(envConf: ViteEnv): ViteEnv {
  Object.keys(envConf).forEach((envName) => {
    let envValue = envConf[envName].replace(/\\n/g, '\n');
    envValue === 'true' && (envValue = true);
    envValue === 'false' && (envValue = false);
    if (envName === 'VITE_PORT') {
      envValue = Number(envValue);
    }
    if (envName === 'VITE_PROXY' && envValue) {
      try {
        envValue = JSON.parse(envValue.replace(/'/g, '"'));
      } catch (error) {
        envValue = [];
      }
    }
    envConf[envName] = envValue;
    if (isString(envValue)) {
      process.env[envName] = envValue;
    } else if (isObject(envValue)) {
      process.env[envName] = JSON.stringify(envValue);
    }
  });
  return envConf;
}

/**
 * 获取当前环境下生效的配置文件名
 */
function getConfFiles() {
  const script = process.env.npm_lifecycle_script;
  const reg = new RegExp('--mode ([a-z_\\d]+)');
  const result = reg.exec(script as string) as any;
  if (result) {
    const mode = result[1] as string;
    return ['.env', `.env.${mode}`];
  }
  return ['.env', '.env.production'];
}

/**
 * Get the environment variables starting with the specified prefix
 * @param match prefix
 * @param confFiles ext
 */
export function getEnvConfig(match = 'VITE_GLOB_', confFiles = getConfFiles()) {
  let envConfig = {};
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)));
      envConfig = { ...envConfig, ...env };
    } catch (e) {
      console.error(`Error in parsing ${item}`, e);
    }
  });
  const reg = new RegExp(`^(${match})`);
  Object.keys(envConfig).forEach((key) => {
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key);
    }
  });
  return envConfig;
}

/**
 * Get user root directory
 * @param dir file path
 */
export function getRootPath(...dir: string[]) {
  return path.resolve(process.cwd(), ...dir);
}
