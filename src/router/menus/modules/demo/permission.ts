import type { MenuModule } from '/@/router/types';
import { t } from '/@/hooks/web/useI18n';

const menu: MenuModule = {
  orderNo: 15,
  menu: {
    name: t('routes.demo.permission.permission'),
    path: '/permission',
    children: [
      {
        path: 'front',
        name: t('routes.demo.permission.front'),
        children: [
          {
            path: 'page',
            name: t('routes.demo.permission.frontPage'),
          },
          {
            path: 'btn',
            name: t('routes.demo.permission.frontBtn'),
          },
          {
            path: 'auth-pageA',
            name: t('routes.demo.permission.frontTestA'),
          },
          {
            path: 'auth-pageB',
            name: t('routes.demo.permission.frontTestB'),
          },
        ],
      },
      {
        path: 'back',
        name: t('routes.demo.permission.back'),
        children: [
          {
            path: 'page',
            name: t('routes.demo.permission.backPage'),
          },
          {
            path: 'btn',
            name: t('routes.demo.permission.backBtn'),
          },
        ],
      },
    ],
  },
};
export default menu;
