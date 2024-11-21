import type { RouteRecordRaw } from 'vue-router';

import { BasicLayout, MicroAppView } from '#/layouts';
// import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: BasicLayout,
    meta: {
      keepAlive: true,
      order: 1000,
      // title: $t('page.micro.title'),
      title: 'Micro',
    },
    name: 'Micro',
    path: '/micro',
    children: [
      {
        meta: {
          icon: 'ic:baseline-view-in-ar',
          keepAlive: true,
          micro: {
            baseroute: '/vben-antd',
            hash: '/analytics',
            host: 'http://localhost:5666',
            name: 'antd',
          },
          title: 'AntD-analytics',
        },
        name: 'MicroDemo',
        path: '/antd/analytics',
        component: MicroAppView,
      },
      {
        meta: {
          icon: 'ic:baseline-view-in-ar',
          keepAlive: true,
          micro: {
            baseroute: '/vben-antd',
            hash: '/workspace',
            host: 'http://localhost:5666',
            name: 'antd',
          },
          title: 'AntD-workspace',
        },
        name: 'MicroWorkspaceView',
        path: '/antd/workspace',
        component: MicroAppView,
      },
    ],
  },
];

export default routes;
