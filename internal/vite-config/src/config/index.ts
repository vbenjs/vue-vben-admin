import { join } from 'node:path';

import { fs } from '@vben/node-utils';

import { defineApplicationConfig } from './application';
import { defineLibraryConfig } from './library';

import type { DefineConfig } from '../typing';

export * from './application';
export * from './library';

function defineConfig(options: DefineConfig = {}) {
  const { type = 'auto', ...defineOptions } = options;

  let projectType = type;

  // 根据包是否存在 index.html,自动判断类型
  if (type === 'auto') {
    const htmlPath = join(process.cwd(), 'index.html');
    projectType = fs.existsSync(htmlPath) ? 'appcation' : 'library';
  }

  if (projectType === 'appcation') {
    return defineApplicationConfig(defineOptions);
  } else if (projectType === 'library') {
    return defineLibraryConfig(defineOptions);
  }
}

export { defineConfig };
