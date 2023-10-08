import GenerateConfig from 'unplugin-config/vite';
import { type PluginOption } from 'vite';

import { getEnvConfig } from '../utils/env';
import { strToHex } from '../utils/hash';

const GLOBAL_CONFIG_FILE_NAME = '_app.config.js';
// This constant sets the output directory for the Vite package
const OUTPUT_DIR = 'dist';
const config: any = getEnvConfig().then();
const APP_NAME = strToHex(config?.VITE_GLOB_APP_TITLE ?? 'Vben Admin');
export function createConfigPluginConfig(shouldGenerateConfig: boolean): PluginOption {
  // https://github.com/kirklin/unplugin-config
  return GenerateConfig({
    disabledConfig: !shouldGenerateConfig,
    globConfigFileName: GLOBAL_CONFIG_FILE_NAME,
    outputDir: OUTPUT_DIR,
    appName: APP_NAME,
    envConfigPrefix: 'VITE_GLOB_',
  });
}
