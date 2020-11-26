import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const tree: AppRouteModule = {
  layout: {
    path: '/tree',
    name: 'TreeDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/tree/basic',
    meta: {
      icon: 'clarity:tree-view-line',
      title: 'routes.demo.tree.tree',
    },
  },
  routes: [
    {
      path: '/basic',
      name: 'BasicTreeDemo',
      component: () => import('/@/views/demo/tree/index.vue'),
      meta: {
        title: 'routes.demo.tree.basic',
      },
    },
    {
      path: '/editTree',
      name: 'EditTreeDemo',
      component: () => import('/@/views/demo/tree/EditTree.vue'),
      meta: {
        title: 'routes.demo.tree.editTree',
      },
    },
    {
      path: '/actionTree',
      name: 'ActionTreeDemo',
      component: () => import('/@/views/demo/tree/ActionTree.vue'),
      meta: {
        title: 'routes.demo.tree.actionTree',
      },
    },
  ],
};

export default tree;
