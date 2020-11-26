import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const editor: AppRouteModule = {
  layout: {
    path: '/editor',
    name: 'Editor',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/editor/markdown',
    meta: {
      icon: 'ant-design:table-outlined',
      title: 'routes.demo.editor.editor',
    },
  },

  routes: [
    {
      path: '/markdown',
      name: 'MarkdownDemo',
      component: () => import('/@/views/demo/editor/Markdown.vue'),
      meta: {
        title: 'routes.demo.editor.markdown',
      },
    },
    {
      path: '/tinymce',
      name: 'TinymceDemo',
      meta: {
        title: 'routes.demo.editor.tinymce',
      },
      redirect: '/editor/tinymce/index',
      children: [
        {
          path: 'index',
          name: 'TinymceBasicDemo',
          component: () => import('/@/views/demo/editor/tinymce/index.vue'),
          meta: {
            title: 'routes.demo.editor.tinymceBasic',
          },
        },
        // TODO
        {
          path: 'editor',
          name: 'TinymceFormDemo',
          component: () => import('/@/views/demo/editor/tinymce/Editor.vue'),
          meta: {
            title: 'routes.demo.editor.tinymceForm',
          },
        },
      ],
    },
  ],
};

export default editor;
