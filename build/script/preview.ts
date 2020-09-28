import chalk from 'chalk';
import Koa from 'koa';
import inquirer from 'inquirer';
import { sh } from 'tasksfile';
import staticServer from 'koa-static';
import portfinder from 'portfinder';
import { resolve } from 'path';
import viteConfig from '../../vite.config';
import { getIPAddress } from '../utils';

const BUILD = 1;
const NO_BUILD = 2;

// 启动服务器
const startApp = () => {
  const port = 9680;
  portfinder.basePort = port;
  const app = new Koa();
  // const connect = require('connect');
  // const serveStatic = require('serve-static');
  // const app = connect();

  app.use(staticServer(resolve(process.cwd(), viteConfig.outDir || 'dist')));

  portfinder.getPort(async (err, port) => {
    if (err) {
      throw err;
    } else {
      // const publicPath = process.env.BASE_URL;
      app.listen(port, function () {
        const empty = '    ';
        const common = `The preview program is already running:
    - LOCAL: http://localhost:${port}/
    - NETWORK: http://${getIPAddress()}:${port}/
    `;
        console.log(chalk.cyan('\n' + empty + common));
      });
    }
  });
};

const preview = async () => {
  const prompt = inquirer.prompt({
    type: 'list',
    message: 'Please select a preview method',
    name: 'type',
    choices: [
      {
        name: 'Preview after packaging',
        value: BUILD,
      },
      {
        name: `No packaging, preview directly (need to have dist file after packaging)`,
        value: NO_BUILD,
      },
    ],
  });
  const { type } = await prompt;
  if (type === BUILD) {
    await sh('npm run build', {
      async: true,
      nopipe: true,
    });
  }
  startApp();
};

(() => {
  preview();
})();
