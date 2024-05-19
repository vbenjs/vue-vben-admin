import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { fs } from '@vben/node-utils';
import { type PluginOption } from 'vite';

/**
 * 用于生成将loading样式注入到项目中
 * 为多app提供loading样式，无需在每个 app -> index.html单独引入
 */
async function viteInjectAppLoadingPlugin(): Promise<PluginOption | undefined> {
  const loadingHtml = await getLoadingRawByHtmlTemplate();

  if (!loadingHtml) {
    return;
  }

  return {
    enforce: 'pre',
    name: 'vite:inject-app-loading',
    transformIndexHtml: {
      handler(html) {
        const re = /<div\s*id\s*=\s*"app"\s*>(\s*)<\/div>/;
        html = html.replace(re, `<div id="app">${loadingHtml}</div>`);
        return html;
      },
      order: 'pre',
    },
  };
}

/**
 * 用于获取loading的html模板
 */
async function getLoadingRawByHtmlTemplate() {
  const __dirname = fileURLToPath(new URL('.', import.meta.url));
  const loadingPath = join(__dirname, './loading.html');
  if (!fs.existsSync(loadingPath)) {
    return;
  }

  const htmlRaw = await fs.readFile(loadingPath, 'utf8');
  return htmlRaw;
}

export { viteInjectAppLoadingPlugin };
