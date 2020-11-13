import chalk from 'chalk';
import Koa from 'koa';
// import inquirer from 'inquirer';
import staticServer from 'koa-static';
import portfinder from 'portfinder';
import { resolve } from 'path';
import viteConfig from '../../vite.config';
import { getIPAddress } from '../utils';
// import { runBuild } from './postBuild';

// const BUILD = 1;
// const NO_BUILD = 2;

// start server
const startApp = () => {
  const port = 9680;
  portfinder.basePort = port;
  const app = new Koa();

  app.use(staticServer(resolve(process.cwd(), viteConfig.outDir || 'dist')));

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

// export const runPreview = async () => {
//   // const prompt = inquirer.prompt({
//   //   type: 'list',
//   //   message: 'Please select a preview method',
//   //   name: 'type',
//   //   choices: [
//   //     {
//   //       name: 'Preview after packaging',
//   //       value: BUILD,
//   //     },
//   //     {
//   //       name: `No packaging, preview directly (need to have dist file after packaging)`,
//   //       value: NO_BUILD,
//   //     },
//   //   ],
//   // });
//   const { type } = await prompt;
//   if (type === BUILD) {
//     await runBuild(true);
//   }
// };
startApp();
