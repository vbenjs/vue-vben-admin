import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/type';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/dashboard';

const layout: LayoutType = {
  path: prefix,
  component: PAGE_LAYOUT_COMPONENT,
  redirect: '/dashboard/welcome',
  meta: {
    title: 'Dashboard',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/welcome',
    name: 'Welcome',
    component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
    meta: {
      title: '欢迎页',
      affix: true,
    },
  },
  {
    path: '/analysis',
    name: 'Analysis',
    component: () => createAsyncComponent(import('@/views/dashboard/welcome/index.vue')),
    meta: {
      title: '分析页',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
