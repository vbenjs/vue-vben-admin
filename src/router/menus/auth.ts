import { NormMenuItem } from '@/router/types';

export const orderNo = 20;
export default {
  name: '权限测试',
  path: '/auth',
  icon: 'home|svg',
  children: [
    {
      name: '管理员可见',
      path: '/adminRole',
      icon: 'home|svg',
      children: [
        {
          name: '测试页1',
          path: '/test1',
          icon: 'home|svg',
        },
        {
          name: '测试页2',
          path: '/test2',
          icon: 'home|svg',
        },
      ],
    },
    {
      name: '普通用户可见',
      path: '/normalRole',
      icon: 'home|svg',
    },
  ],
} as NormMenuItem;
