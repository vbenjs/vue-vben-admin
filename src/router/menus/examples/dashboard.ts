import { NormMenuItem } from '@/router/types';

export const orderNo = 10;
export default {
  name: 'Dashboard',
  path: '/dashboard',
  children: [
    {
      path: '/workbench',
      name: '工作台',
    },
    {
      path: '/analysis',
      name: '分析页',
    },

    {
      path: '/welcome',
      name: '欢迎页',
    },
    {
      path: '/driver',
      name: '引导页',
    },
  ],
} as NormMenuItem;
