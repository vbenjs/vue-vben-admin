import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';
import { t } from '@/hooks/web/useI18n';

const permission: AppRouteModule = {
  path: '/form-designer',
  name: 'Form-designer',
  component: LAYOUT,
  meta: {
    orderNo: 10000,
    icon: 'ion:build-outline',
    title: t('routes.demo.formDesign.moduleName'),
  },
  children: [
    {
      path: 'design',
      name: 'Design',
      meta: {
        title: t('routes.demo.formDesign.moduleName'),
      },
      component: () => import('@/views/form-design/index.vue'),
    },
    {
      path: 'example1',
      name: 'Example1',
      meta: {
        title: t('routes.demo.formDesign.example'),
      },
      component: () => import('@/views/form-design/examples/baseForm.vue'),
    },
  ],
};

export default permission;
