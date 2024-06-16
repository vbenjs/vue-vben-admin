import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout } from '@/layouts';
import { $t } from '@vben/locales/helper';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      icon: 'ic:round-menu',
      keepAlive: true,
      order: 1000,
      title: $t('page.nested.page'),
    },
    name: 'Nested',
    path: '/nested',
    redirect: '/nested/menu1',
    children: [
      {
        name: 'Menu1',
        path: 'menu1',
        component: () => import('@/views/nested/menu-1.vue'),
        meta: {
          icon: 'ic:round-menu',
          keepAlive: true,
          title: $t('page.nested.menu1'),
        },
      },
      {
        name: 'Menu2',
        path: 'menu2',
        meta: {
          icon: 'ic:round-menu',
          keepAlive: true,
          title: $t('page.nested.menu2'),
        },
        redirect: '/nested/menu2/menu2-1',
        children: [
          {
            name: 'Menu21',
            path: 'menu2-1',
            component: () => import('@/views/nested/menu-2-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.nested.menu21'),
            },
          },
        ],
      },
      {
        name: 'Menu3',
        path: 'menu3',
        meta: {
          icon: 'ic:round-menu',
          title: $t('page.nested.menu3'),
        },
        redirect: '/nested/menu3/menu3-1',
        children: [
          {
            name: 'Menu31',
            path: 'menu3-1',
            component: () => import('@/views/nested/menu-3-1.vue'),
            meta: {
              icon: 'ic:round-menu',
              keepAlive: true,
              title: $t('page.nested.menu31'),
            },
          },
          {
            name: 'Menu32',
            path: 'menu3-2',
            meta: {
              icon: 'ic:round-menu',
              title: $t('page.nested.menu32'),
            },
            redirect: '/nested/menu3/menu3-2/menu3-2-1',
            children: [
              {
                name: 'Menu321',
                path: 'menu3-2-1',
                component: () => import('@/views/nested/menu-3-2-1.vue'),
                meta: {
                  icon: 'ic:round-menu',
                  keepAlive: true,
                  title: $t('page.nested.menu321'),
                },
              },
            ],
          },
        ],
      },
    ],
  },
];

export default routes;
