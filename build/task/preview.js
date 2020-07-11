const resolve = require('../getCwdPath');
const { getIPAddress, inquirerPrompt } = require('../utils');
const Koa = require('koa');
const chalk = require('chalk');
const runjs = require('runjs');
const portfinder = require('portfinder');
const staticServer = require('koa-static');

const { run } = runjs;
const BUILD = 1;
const NO_BUILD = 2;
// const util = require('../util');

// 启动服务器
const startApp = () => {
  const port = 9680;
  portfinder.basePort = port;
  const app = new Koa();
  // const connect = require('connect');
  // const serveStatic = require('serve-static');
  // const app = connect();

  app.use(staticServer(resolve(`./dist`)));

  portfinder.getPort(async (err, port) => {
    if (err) {
      throw err;
    } else {
      const publicPath = process.env.BASE_URL;
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
  const prompt = inquirerPrompt({
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
    await run('npm run build no-uv', { async: true });
    await build({ noUv: true });
  }
  startApp();
};

preview();
