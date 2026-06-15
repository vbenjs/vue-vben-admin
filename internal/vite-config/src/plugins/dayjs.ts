import type { Plugin } from 'vite';

function viteDayjsPlugin(): Plugin {
  return {
    name: 'vite-dayjs-plugin',
    enforce: 'pre',
    async resolveId(source, importer, options) {
      // 1) 已经使用了 dayjs/esm 的不处理
      if (source.startsWith('dayjs/esm')) return null;

      // 2) 根入口：dayjs -> dayjs/esm
      if (source === 'dayjs') {
        return await this.resolve('dayjs/esm', importer, {
          skipSelf: true,
          ...options,
        });
      }

      // 3) 插件入口的多种写法
      //    - dayjs/plugin/xxx.js           -> dayjs/esm/plugin/xxx/index.js
      //    - dayjs/plugin/xxx              -> dayjs/esm/plugin/xxx
      const pluginWithJs = source.match(/^dayjs\/plugin\/([^/]+)\.js$/);
      if (pluginWithJs) {
        const target = `dayjs/esm/plugin/${pluginWithJs[1]}/index.js`;
        return await this.resolve(target, importer, {
          skipSelf: true,
          ...options,
        });
      }

      const pluginBare = source.match(/^dayjs\/plugin\/([^/]+)$/);
      if (pluginBare) {
        const target = `dayjs/esm/plugin/${pluginBare[1]}`;
        return await this.resolve(target, importer, {
          skipSelf: true,
          ...options,
        });
      }

      // 4) 处理多语言包
      //    - dayjs/locale/xxx.js          -> dayjs/esm/locale/xxx.js
      const localeWithJs = source.match(/^dayjs\/locale\/([^/]+)\.js$/);
      if (localeWithJs) {
        const target = `dayjs/esm/locale/${localeWithJs[1]}.js`;
        return await this.resolve(target, importer, {
          skipSelf: true,
          ...options,
        });
      }
      const localeBare = source.match(/^dayjs\/locale\/([^/]+)$/);
      if (localeBare) {
        const target = `dayjs/esm/locale/${localeBare[1]}`;
        return await this.resolve(target, importer, {
          skipSelf: true,
          ...options,
        });
      }

      return null;
    },
    config() {
      return {
        optimizeDeps: {
          exclude: ['dayjs'],
        },
      };
    },
  };
}
export { viteDayjsPlugin };
