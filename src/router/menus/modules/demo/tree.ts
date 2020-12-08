import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 50,
  menu: {
    path: '/tree',
    name: t('routes.demo.tree.tree'),
    children: [
      {
        path: 'basic',
        name: t('routes.demo.tree.basic'),
      },
      {
        path: 'editTree',
        name: t('routes.demo.tree.editTree'),
      },
      {
        path: 'actionTree',
        name: t('routes.demo.tree.actionTree'),
      },
    ],
  },
};
export default menu;
