import fs from 'node:fs/promises';

import { execa } from 'execa';

async function formatFile(filepath: string) {
  await execa('oxfmt', [filepath], {
    stdio: 'inherit',
  });

  return await fs.readFile(filepath, 'utf8');
}

export { formatFile };
