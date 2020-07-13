import { NormMenuItem } from '@/router/types';

export const orderNo = 1000;
export default {
  name: '测试页',
  path: '/test',
  icon: 'home|svg',
  children: [
    {
      name: '测试页1',
      path: '/test1',
    },
    {
      name: '测试页2',
      path: '/test2',
    },
  ],
} as NormMenuItem;
