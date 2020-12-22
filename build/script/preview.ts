import chalk from 'chalk';
import Koa from 'koa';
// import inquirer from 'inquirer';
import staticServer from 'koa-static';
import portfinder from 'portfinder';
import { resolve } from 'path';
import { getIPAddress } from '../utils';

// start server
const startApp = () => {
  const port = 9680;
  portfinder.basePort = port;
  const app = new Koa();

  app.use(staticServer(resolve(process.cwd(), 'dist')));

  portfinder.getPort(async (err, port) => {
    if (err) {
      throw err;
    } else {
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

startApp();
