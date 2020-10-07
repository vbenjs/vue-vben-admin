import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/plugin',
    name: 'Plugin',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/plugin/print',
    meta: {
      icon: 'ant-design:home-outlined',
      title: '插件',
    },
  },

  routes: [
    {
      path: '/print',
      name: 'PrintDemo',
      component: () => import('/@/views/demo/plugin/print/index.vue'),
      meta: {
        title: '打印组件',
      },
    },
  ],
} as AppRouteModule;
