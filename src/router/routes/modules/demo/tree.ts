import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/tree',
    name: 'TreeDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/tree/basic',
    meta: {
      icon: 'clarity:tree-view-line',
      title: 'Tree',
    },
  },
  routes: [
    {
      path: '/basic',
      name: 'BasicTreeDemo',
      component: () => import('/@/views/demo/tree/index.vue'),
      meta: {
        title: '基础树',
      },
    },
    {
      path: '/editTree',
      name: 'EditTreeDemo',
      component: () => import('/@/views/demo/tree/EditTree.vue'),
      meta: {
        title: '右键示例',
      },
    },
    {
      path: '/actionTree',
      name: 'ActionTreeDemo',
      component: () => import('/@/views/demo/tree/ActionTree.vue'),
      meta: {
        title: '函数操作示例',
      },
    },
  ],
} as AppRouteModule;
