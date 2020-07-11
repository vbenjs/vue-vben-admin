import { NormMenuItem } from '@/router/type';

export const orderNo = 100;
export default {
  name: '异常页',
  path: '/exception',
  icon: 'home|svg',
  children: [
    {
      name: '404错误',
      path: '/404',
    },
    {
      name: '500错误',
      path: '/500',
    },
    {
      name: '网络错误',
      path: '/net-work-error',
    },
    {
      name: '页面超时',
      path: '/page-time-out',
    },
    {
      name: '页面无数据',
      path: '/not-data',
    },
  ],
} as NormMenuItem;
