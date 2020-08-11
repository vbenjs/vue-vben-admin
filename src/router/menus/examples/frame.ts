import { NormMenuItem } from '@/router/types';

export const orderNo = 100;
export default {
  name: '外部页面(会缓存)',
  path: '/frame',
  children: [
    {
      name: 'antVue文档(内嵌)',
      path: '/antv',
    },
    {
      name: '项目文档(内嵌)',
      path: '/doc',
    },
    {
      name: '项目文档(外链)',
      path: '/docExternal',
    },
  ],
} as NormMenuItem;
