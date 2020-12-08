import type { AppRouteModule } from '/@/router/types';

import { getParentLayout, LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const editor: AppRouteModule = {
  path: '/editor',
  name: 'Editor',
  component: LAYOUT,
  redirect: '/editor/markdown',
  meta: {
    icon: 'carbon:table-split',
    title: t('routes.demo.editor.editor'),
  },
  children: [
    {
      path: 'markdown',
      name: 'MarkdownDemo',
      component: () => import('/@/views/demo/editor/Markdown.vue'),
      meta: {
        title: t('routes.demo.editor.markdown'),
      },
    },
    {
      path: 'tinymce',
      component: getParentLayout('TinymceDemo'),
      name: 'TinymceDemo',
      meta: {
        title: t('routes.demo.editor.tinymce'),
      },
      redirect: '/editor/tinymce/index',
      children: [
        {
          path: 'index',
          name: 'TinymceBasicDemo',
          component: () => import('/@/views/demo/editor/tinymce/index.vue'),
          meta: {
            title: t('routes.demo.editor.tinymceBasic'),
          },
        },
        {
          path: 'editor',
          name: 'TinymceFormDemo',
          component: () => import('/@/views/demo/editor/tinymce/Editor.vue'),
          meta: {
            title: t('routes.demo.editor.tinymceForm'),
          },
        },
      ],
    },
  ],
};

export default editor;
