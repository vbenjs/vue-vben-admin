import type { RouteRecordRaw } from 'vue-router';

// BasicLayout
import { LayoutContent } from '#/layouts';
import { $t } from '#/locales';

const routes: RouteRecordRaw[] = [
  {
    component: LayoutContent,
    meta: {
      icon: 'ic:baseline-view-in-ar',
      keepAlive: true,
      order: 1000,
      title: $t('demos.title'),
    },
    name: 'Demos',
    path: '/demos',
    children: [
      {
        meta: {
          title: $t('demos.antd'),
        },
        name: 'AntDesignDemos',
        path: '/demos/ant-design',
        component: () => import('#/views/demos/antd/index.vue'),
      },
    ],
  },
];

export default routes;
