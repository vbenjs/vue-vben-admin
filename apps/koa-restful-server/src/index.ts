import { bootstrap } from '@wangminghua/koa-restful-extra';
import KoaStatic from 'koa-static';

import './core'; // 加载核心
import './service'; // 加载api

const port = process.env.PORT || 3000;

bootstrap(
  port,
  {
    logs: false,
  },
  {
    afterHook: (koa) => {
      koa.use(KoaStatic('./static'));
    },
  },
);
