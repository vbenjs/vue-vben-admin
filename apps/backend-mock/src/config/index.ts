import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

import * as yaml from 'js-yaml';

const configFileNameObj = {
  development: 'dev',
  production: 'prod',
};

const env = process.env.NODE_ENV;

const configFactory = () => {
  return yaml.load(
    readFileSync(
      join(process.cwd(), 'src', 'config', `${configFileNameObj[env]}.yml`),
      'utf8',
    ),
  ) as Record<string, any>;
};

export default configFactory;
