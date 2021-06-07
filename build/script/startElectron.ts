import { createServer } from 'vite';
import path from 'path';
import { startCompilerElectron } from './compilerElectron';

(async () => {
  const server = await createServer({
    root: path.resolve(__dirname, '../../'),
  });

  const app = await server.listen();
  const port = app.config.server.port;
  startCompilerElectron(port);
  process.env.PORT = `${port}`;
})();
