import { NormMenuItem } from '@/router/types';

export const orderNo = 100;
export default {
  name: '插件',
  path: '/plugins-demo',

  children: [
    {
      name: '持久化插件',
      path: '/cache',
    },
    {
      name: '国际化插件',
      path: '/i18n',
    },
  ],
} as NormMenuItem;
