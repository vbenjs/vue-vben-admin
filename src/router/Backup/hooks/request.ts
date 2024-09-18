import type { AppRouteModule } from '@/router/types';

import { LAYOUT } from '@/router/constant';

const charts: AppRouteModule = {
  path: '/useRequest',
  name: 'useRequest',
  component: LAYOUT,
  redirect: '/useRequest/base',
  meta: {
    orderNo: 900,
    icon: 'ant-design:api-outlined',
    title: 'useRequest',
  },
  children: [
    {
      path: 'base',
      name: 'useRequest-base',
      meta: { title: '基础用法' },
      component: () => import('@/views/hooks/request/base'),
    },
    {
      path: 'loading-delay',
      name: 'useRequest-loading-delay',
      meta: { title: 'Loading Delay' },
      component: () => import('@/views/hooks/request/loading-delay'),
    },
    {
      path: 'polling',
      name: 'useRequest-polling',
      meta: { title: '轮询' },
      component: () => import('@/views/hooks/request/polling'),
    },
    {
      path: 'ready',
      name: 'useRequest-ready',
      meta: { title: 'Ready' },
      component: () => import('@/views/hooks/request/ready'),
    },
    {
      path: 'refresy-deps',
      name: 'useRequest-refresy-deps',
      meta: { title: '依赖刷新' },
      component: () => import('@/views/hooks/request/refresy-deps'),
    },
    {
      path: 'refresh-on-window-focus',
      name: 'useRequest-refresh-on-window-focus',
      meta: { title: '屏幕聚焦重新请求' },
      component: () => import('@/views/hooks/request/refresh-on-window-focus'),
    },
    {
      path: 'debounce',
      name: 'useRequest-debounce',
      meta: { title: '防抖' },
      component: () => import('@/views/hooks/request/debounce'),
    },
    {
      path: 'throttle',
      name: 'useRequest-throttle',
      meta: { title: '节流' },
      component: () => import('@/views/hooks/request/throttle'),
    },
    {
      path: 'cache',
      name: 'useRequest-cache',
      meta: { title: '缓存&SWR' },
      component: () => import('@/views/hooks/request/cache'),
    },
    {
      path: 'retry',
      name: 'useRequest-retry',
      meta: { title: '错误重试' },
      component: () => import('@/views/hooks/request/retry'),
    },
  ],
};

export default charts;
