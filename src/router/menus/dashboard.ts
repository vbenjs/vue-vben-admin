import { NormMenuItem } from '@/router/type';

export const orderNo = 10;
export default {
  name: 'Dashboard',
  path: '/dashboard',
  icon: 'home|svg',
  children: [
    {
      path: '/welcome',
      name: '首页',
    },
    {
      path: '/analysis',
      name: '分析页',
    },
  ],
} as NormMenuItem;
