import { NormMenuItem } from '@/router/types';

export const orderNo = 20;
export default {
  name: '权限测试',
  path: '/auth',
  icon: 'home|svg',
  children: [
    {
      name: '基于角色',
      path: '/role',
      children: [
        {
          name: '页面权限',
          path: '/page',
        },
        {
          name: '按钮权限',
          path: '/btn',
        },
        {
          name: 'admin可见',
          path: '/test1',
        },
        {
          name: 'normal可见',
          path: '/test2',
        },
      ],
    },
    {
      name: '基于后台',
      path: '/back-auth',
    },
  ],
} as NormMenuItem;
