import { NormMenuItem } from '@/router/types';

export const orderNo = 10;
export default {
  name: 'Dashboard',
  path: '/dashboard',
  children: [
    {
      path: '/analysis',
      name: '分析页',
    },
    {
      path: '/workbench',
      name: '工作台',
    },
    {
      path: '/welcome',
      name: '欢迎页',
    },
  ],
} as NormMenuItem;
