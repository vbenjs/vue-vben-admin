import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 2000,
  menu: {
    name: t('routes.demo.level.level'),
    path: '/level',
    children: [
      {
        path: 'menu1',
        name: 'Menu1',
        children: [
          {
            path: 'menu1-1',
            name: 'Menu1-1',
            children: [
              {
                path: 'menu1-1-1',
                name: 'Menu1-1-1',
              },
            ],
          },
          {
            path: 'menu1-2',
            name: 'Menu1-2',
          },
        ],
      },
      {
        path: 'menu2',
        name: 'Menu2',
      },
    ],
  },
};
export default menu;
