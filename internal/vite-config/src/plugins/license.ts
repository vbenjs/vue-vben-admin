import type {
  NormalizedOutputOptions,
  OutputAsset,
  OutputBundle,
  OutputChunk,
} from 'rollup';
import type { PluginOption } from 'vite';

import { EOL } from 'node:os';

import { dateUtil, readPackageJSON } from '@vben/node-utils';

/**
 * 用于将配置文件抽离出来并注入到项目中
 * @returns
 */

async function viteLicensePlugin(
  root = process.cwd(),
): Promise<PluginOption | undefined> {
  const {
    description = '',
    homepage = '',
    version = '',
  } = await readPackageJSON(root);

  return {
    apply: 'build',
    enforce: 'post',
    generateBundle: {
      handler: (_options: NormalizedOutputOptions, bundle: OutputBundle) => {
        const date = dateUtil.format('YYYY-MM-DD ');

        const copyrightText = `/*!
  * Vben Admin Pro
  * Version: ${version}
  * Author: vben
  * Copyright (C) 2024 Vben
  * License: MIT License
  * Description: ${description}
  * Date Created: ${date}
  * Homepage: ${homepage}
  * Contact: ann.vben@gmail.com
*/
              `.trim();

        for (const [, fileContent] of Object.entries(bundle)) {
          if (
            fileContent.type === 'asset' ||
            (fileContent.type === 'chunk' && fileContent.isEntry)
          ) {
            const chunkContent = fileContent as OutputChunk;
            const assetContent = fileContent as OutputAsset;
            // 插入版权信息
            const content =
              typeof assetContent.source === 'string'
                ? assetContent.source
                : chunkContent.code;
            const updatedContent = `${copyrightText}${EOL}${content}`;

            // 更新bundle
            if (assetContent.source === undefined) {
              (fileContent as OutputChunk).code = updatedContent;
            } else {
              (fileContent as OutputAsset).source = updatedContent;
            }
          }
        }
      },
      order: 'post',
    },
    name: 'vite:license',
  };
}

export { viteLicensePlugin };
