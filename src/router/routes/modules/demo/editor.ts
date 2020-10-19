import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/editor',
    name: 'Editor',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/editor/markdown',
    meta: {
      icon: 'ant-design:table-outlined',
      title: '编辑器',
    },
  },

  routes: [
    {
      path: '/markdown',
      name: 'MarkdownDemo',
      component: () => import('/@/views/demo/editor/Markdown.vue'),
      meta: {
        title: 'markdown编辑器',
      },
    },
  ],
} as AppRouteModule;
