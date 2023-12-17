import { DefaultControllerOptions } from '@wangminghua/koa-restful';
import { swagger2html } from '@wangminghua/koa-restful-extra';

import fs from 'fs';
import { join } from 'path';

DefaultControllerOptions.defaultRoutePrefix = '';

const html = swagger2html('src/**/*.ts');
const dir = 'static/swagger';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

fs.writeFileSync(join(dir, 'index.html'), html, { encoding: 'utf-8' });
