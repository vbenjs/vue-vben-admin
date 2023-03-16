import type { AppRouteModule } from '/@/router/types';

import { LAYOUT } from '/@/router/constant';
import { t } from '/@/hooks/web/useI18n';

const extension: AppRouteModule = {
  path: '/extension',
  name: 'Extension',
  component: LAYOUT,
  redirect: '/extension/database',
  meta: {
    orderNo: 40,
    icon: 'ant-design:appstore-add-outlined',
    title: t('routes.extension.title'),
  },
  children: [
    {
      path: 'database',
      name: 'Database',
      meta: {
        title: t('routes.extension.database.title'),
        ignoreKeepAlive: false,
      },
      component: () => import('/@/views/extension/database/index.vue'),
    },
    {
      path: 'template',
      name: 'Template',
      meta: {
        title: t('routes.extension.template.title'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/extension/template/index.vue'),
    },
    {
      path: 'code',
      name: 'Code',
      meta: {
        title: t('routes.extension.code.title'),
        ignoreKeepAlive: true,
      },
      component: () => import('/@/views/extension/code/index.vue'),
    },
  ],
};

export default extension;
