import type { MenuModule } from '/@/router/types.d';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 30,
  menu: {
    path: '/table',
    name: t('routes.demo.table.table'),
    children: [
      {
        path: 'basic',
        name: t('routes.demo.table.basic'),
      },
      {
        path: 'treeTable',
        name: t('routes.demo.table.treeTable'),
      },
      {
        path: 'fetchTable',
        name: t('routes.demo.table.fetchTable'),
      },
      {
        path: 'fixedColumn',
        name: t('routes.demo.table.fixedColumn'),
      },
      {
        path: 'customerCell',
        name: t('routes.demo.table.customerCell'),
      },
      {
        path: 'formTable',
        name: t('routes.demo.table.formTable'),
      },
      {
        path: 'useTable',
        name: t('routes.demo.table.useTable'),
      },
      {
        path: 'refTable',
        name: t('routes.demo.table.refTable'),
      },
      {
        path: 'multipleHeader',
        name: t('routes.demo.table.multipleHeader'),
      },
      {
        path: 'mergeHeader',
        name: t('routes.demo.table.mergeHeader'),
      },
      {
        path: 'expandTable',
        name: t('routes.demo.table.expandTable'),
      },
      {
        path: 'fixedHeight',
        name: t('routes.demo.table.fixedHeight'),
      },
      {
        path: 'footerTable',
        name: t('routes.demo.table.footerTable'),
      },
      {
        path: 'editCellTable',
        name: t('routes.demo.table.editCellTable'),
      },
      {
        path: 'editRowTable',
        name: t('routes.demo.table.editRowTable'),
      },
    ],
  },
};
export default menu;
