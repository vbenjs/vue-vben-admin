import { NormMenuItem } from '@/router/types';

export const orderNo = 30;
export default {
  name: '组件',
  path: '/components',

  children: [
    {
      name: '懒加载组件',
      path: '/lazy-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
        {
          name: '延时加载示例',
          path: '/timeout',
        },
        {
          name: '过渡动画示例',
          path: '/transition',
        },
        {
          name: '特定视口内示例',
          path: '/viewport',
        },
      ],
    },
    {
      name: '滚动组件',
      path: '/scrollbar-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
      ],
    },
    {
      name: '弹窗扩展',
      path: '/modal-demo',
    },
    {
      path: '/icon-demo',
      name: '图标',
    },
  ],
} as NormMenuItem;
