import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: t('routes.demo.editor.editor'),
    path: '/editor',
    children: [
      {
        path: 'markdown',
        name: t('routes.demo.editor.markdown'),
      },
      {
        path: 'tinymce',
        name: t('routes.demo.editor.tinymce'),
        children: [
          {
            path: 'index',
            name: t('routes.demo.editor.tinymceBasic'),
          },
          {
            path: 'editor',
            name: t('routes.demo.editor.tinymceForm'),
          },
        ],
      },
    ],
  },
};
export default menu;
