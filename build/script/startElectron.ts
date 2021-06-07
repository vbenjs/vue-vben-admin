import { createServer } from 'vite';
import { execSync } from 'child_process';
import path from 'path';

(async () => {
  const server = await createServer({
    root: path.resolve(__dirname, '../../'),
  });

  await server.listen();

  execSync('node script/build --env=development --watch');
})();
