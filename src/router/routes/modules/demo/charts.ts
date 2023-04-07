import { t } from '@/hooks/web/useI18n';
import { getParentLayout, LAYOUT } from '@/router/constant';
import type { AppRouteModule } from '@/router/types';

const charts: AppRouteModule = {
  path: '/charts',
  name: 'Charts',
  component: LAYOUT,
  redirect: '/charts/echarts/map',
  meta: {
    orderNo: 500,
    icon: 'ion:bar-chart-outline',
    title: t('routes.demo.charts.charts'),
  },
  children: [
    {
      path: 'echarts',
      name: 'Echarts',
      component: getParentLayout('Echarts'),
      meta: {
        title: 'Echarts',
      },
      redirect: '/charts/echarts/map',
      children: [
        {
          path: 'map',
          name: 'Map',
          component: () => import('@/views/demo/charts/Map.vue'),
          meta: {
            title: t('routes.demo.charts.map'),
          },
        },
        {
          path: 'line',
          name: 'Line',
          component: () => import('@/views/demo/charts/Line.vue'),
          meta: {
            title: t('routes.demo.charts.line'),
          },
        },
        {
          path: 'pie',
          name: 'Pie',
          component: () => import('@/views/demo/charts/Pie.vue'),
          meta: {
            title: t('routes.demo.charts.pie'),
          },
        },
      ],
    },
  ],
};

export default charts;
