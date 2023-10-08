import GenerateConfig from 'unplugin-config/vite';
import { type PluginOption } from 'vite';

import { strToHex } from '../utils/hash';

const GLOBAL_CONFIG_FILE_NAME = '_app.config.js';
// This constant sets the output directory for the Vite package
const OUTPUT_DIR = 'dist';

const APP_NAME = strToHex('Vben Admin');
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
