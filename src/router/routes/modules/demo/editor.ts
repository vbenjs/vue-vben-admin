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
    {
      path: '/tinymce',
      name: 'TinymceDemo',
      meta: {
        title: '富文本',
      },
      redirect: '/editor/tinymce/index',
      children: [
        {
          path: 'index',
          name: 'TinymceBasicDemo',
          component: () => import('/@/views/demo/editor/tinymce/index.vue'),
          meta: {
            title: '基础使用',
          },
        },
        // TODO
        {
          path: 'editor',
          name: 'TinymceFormDemo',
          component: () => import('/@/views/demo/editor/tinymce/Editor.vue'),
          meta: {
            title: '嵌入form使用',
          },
        },
      ],
    },
  ],
} as AppRouteModule;
