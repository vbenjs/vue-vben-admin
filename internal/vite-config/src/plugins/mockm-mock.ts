import type { PluginOption } from 'vite';

import os from 'node:os';
import { Transform } from 'node:stream';

import { colors, consola, getPackage } from '@vben/node-utils';

import getPort from 'get-port';

export const viteMockmPlugin = ({
  mockServerPackage = '@vben/backend-mock',
  port = 5320,
  verbose = true,
} = {}): PluginOption => {
  return {
    async configureServer() {
      const transformStream = new Transform({
        transform(chunk, _, callback) {
          verbose &&
            chunk.toString().match(/\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}/) &&
            process.stdout.write(chunk);
          callback();
        },
      });

      const pkg = await getPackage(mockServerPackage);
      if (!pkg) {
        consola.error(`Package ${mockServerPackage} not found.`);
        return;
      }
      // @ts-ignore-next-line
      // eslint-disable-next-line n/no-extraneous-import
      const { ProcessManager } = await import('@wll8/process-manager');

      const arg = {} as any;
      port = Number(port);
      const [availablePort, testPort, replayPort] = await Promise.all(
        [port, port + 1, port + 2].map((item) => getPort({ port: item })),
      ).catch(() => []);
      if (Number(availablePort) !== port) {
        console.error(`Port is occupied: ${port}.`);
        return;
      }
      const line = Object.entries({
        ...arg,
        '--config': handleSpace(`${pkg.dir}/mm.config.cjs`),
        '--cwd': pkg.dir,
        port,
        replayPort,
        testPort,
      }).map(([key, val]) => `${key}=${val}`);
      const cliArg = [
        handleSpace(`${pkg.dir}/node_modules/mockm/run.js`),
        `--log-line`,
        ...line,
      ];
      const cp = new ProcessManager({
        arg: cliArg,
        stdout: transformStream,
      });
      cp.on(`stdout`, (info = ``) => {
        if (info.includes(`:${port}/`)) {
          consola.log(
            `  ${colors.green('➜')}  ${colors.bold('Mockm Server')}: ${colors.cyan(`http://localhost:${port}/api`)}`,
          );
          if (verbose) {
            console.log('');
            consola.success(colors.bold(colors.green('Mockm Server started.')));
          }
        }
      });
    },
    enforce: 'pre',
    name: 'vite:mockm-server',
  };
};

/**
 * 处理不同系统的命令行空格差异, 在 cp.spawn 中的参数中, 如果包含空格, win 平台需要使用双引号包裹, unix 不需要
 * @param {string} str
 */
function handleSpace(str = ``) {
  const newStr =
    os.type() === 'Windows_NT' && str.includes(` `) ? `"${str}"` : str;
  return newStr;
}
