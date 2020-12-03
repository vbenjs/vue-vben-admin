import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';

const editor: AppRouteModule = {
  path: '/editor',
  name: 'Editor',
  component: LAYOUT,
  redirect: '/editor/markdown',
  meta: {
    icon: 'ant-design:table-outlined',
    title: 'routes.demo.editor.editor',
  },
  children: [
    {
      path: 'markdown',
      name: 'MarkdownDemo',
      component: () => import('/@/views/demo/editor/Markdown.vue'),
      meta: {
        title: 'routes.demo.editor.markdown',
      },
    },
    {
      path: 'tinymce',
      component: getParentLayout('TinymceDemo'),
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
