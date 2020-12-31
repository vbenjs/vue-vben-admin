import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 10,
  menu: {
    name: t('routes.dashboard.dashboard'),
    path: '/dashboard',
    children: [
      {
        path: 'workbench',
        name: t('routes.dashboard.workbench'),
      },
      {
        path: 'analysis',
        name: t('routes.dashboard.analysis'),
      },
    ],
  },
};
export default menu;
