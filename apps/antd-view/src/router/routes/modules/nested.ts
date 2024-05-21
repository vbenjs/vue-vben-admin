import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '@/layouts';

export const nestedRoutes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      keepAlive: true,
      title: '多级菜单',
    },
    name: 'Nested',
    path: '/nested',
    children: [
      {
        name: 'Menu1',
        path: 'menu1',
        component: () => import('@/views/nested/menu-1.vue'),
        meta: {
          keepAlive: true,
          title: '菜单1',
        },
      },
      {
        name: 'Menu2',
        path: 'menu2',
        component: () => import('@/views/nested/menu-2.vue'),
        meta: {
          keepAlive: true,
          title: '菜单2',
        },
      },
      {
        name: 'Menu3',
        path: 'menu3',
        meta: {
          title: '菜单3',
        },
        children: [
          {
            name: 'Menu31',
            path: 'menu3-1',
            component: () => import('@/views/nested/menu-3-1.vue'),
            meta: {
              keepAlive: true,
              title: '菜单3-1',
            },
          },
          {
            name: 'Menu32',
            path: 'menu3-2',
            meta: {
              title: '菜单3-2',
            },
            children: [
              {
                name: 'Menu321',
                path: 'menu3-2-1',
                component: () => import('@/views/nested/menu-3-2-1.vue'),
                meta: {
                  keepAlive: true,
                  title: '菜单3-2-1',
                },
              },
            ],
          },
        ],
      },
    ],
  },
];
