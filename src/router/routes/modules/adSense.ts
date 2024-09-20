import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

import { t } from '@/hooks/web/useI18n';

const adSense: AppRouteModule = {
  path: '/adv',
  name: 'AdSense',
  component: LAYOUT,
  meta: {
    orderNo: 1,
    icon: 'ion:build-outline',
    title: t('routes.adsense.AdvManagement'),
  },
  children: [
    {
      path: '/adsense',
      name: 'AdSensePage',
      meta: { title: t('routes.adsense.Report') },
      component: () => import('@/views/adsense/index.vue'),
    },
  ],
};

export default adSense;
