import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 5000,
  menu: {
    name: t('routes.demo.flow.name'),
    path: '/flow',
    children: [
      {
        path: 'flowChart',
        name: t('routes.demo.flow.flowChart'),
      },
    ],
  },
};
export default menu;
