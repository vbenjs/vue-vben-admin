import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const tree: AppRouteModule = {
  path: '/tree',
  name: 'TreeDemo',
  component: LAYOUT,
  redirect: '/tree/basic',
  meta: {
    icon: 'clarity:tree-view-line',
    title: t('routes.demo.tree.tree'),
  },
  children: [
    {
      path: 'basic',
      name: 'BasicTreeDemo',
      component: () => import('/@/views/demo/tree/index.vue'),
      meta: {
        title: t('routes.demo.tree.basic'),
      },
    },
    {
      path: 'editTree',
      name: 'EditTreeDemo',
      component: () => import('/@/views/demo/tree/EditTree.vue'),
      meta: {
        title: t('routes.demo.tree.editTree'),
      },
    },
    {
      path: 'actionTree',
      name: 'ActionTreeDemo',
      component: () => import('/@/views/demo/tree/ActionTree.vue'),
      meta: {
        title: t('routes.demo.tree.actionTree'),
      },
    },
  ],
};

export default tree;
