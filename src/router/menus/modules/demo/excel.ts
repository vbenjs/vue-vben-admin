import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: t('routes.demo.excel.excel'),
    path: '/excel',
    children: [
      {
        path: 'customExport',
        name: t('routes.demo.excel.customExport'),
      },
      {
        path: 'jsonExport',
        name: t('routes.demo.excel.jsonExport'),
      },
      {
        path: 'arrayExport',
        name: t('routes.demo.excel.arrayExport'),
      },
      {
        path: 'importExcel',
        name: t('routes.demo.excel.importExcel'),
      },
    ],
  },
};
export default menu;
