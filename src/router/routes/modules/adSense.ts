import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

// import { t } from '@/hooks/web/useI18n';

const adSense: AppRouteModule = {
  path: '/adSense',
  name: 'AdSense',
  component: LAYOUT,
  meta: {
    orderNo: 1,
    icon: 'ion:build-outline',
    // title: t('routes.adSense.adSense'),
    title: '广告管理',
  },
  children: [
    {
      path: 'index',
      name: 'AdSensePage',
      meta: { title: 'adsense' },
      component: () => import('@/views/adsense/index.vue'),
    },
  ],
};

export default adSense;
