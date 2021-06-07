import { createServer } from 'vite';
import path from 'path';
import { startCompilerElectron } from './compilerElectron';
import minimist from 'minimist';

(async () => {
  const argv = minimist(process.argv.slice(2));
  console.log(argv);
  const isDev = argv.env === 'development';
  let port: number | undefined = undefined;
  if (isDev) {
    const server = await createServer({
      root: path.resolve(__dirname, '../../'),
    });

    const app = await server.listen();
    port = app.config.server.port;
    process.env.PORT = `${port}`;
  }

  startCompilerElectron(port);
})();
