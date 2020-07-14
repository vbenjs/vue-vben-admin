import { NormMenuItem } from '@/router/types';

export const orderNo = 100;
export default {
  name: '插件',
  path: '/plugins',

  children: [
    {
      name: '持久化插件',
      path: '/cache',
    },
  ],
} as NormMenuItem;
