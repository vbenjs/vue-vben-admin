import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '';

const layout: LayoutType = {
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: 'Redirect',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/redirect/:path*',
    name: 'Redirect',
    component: () => createAsyncComponent(import('@/views/sys/redirect/index.vue')),
    meta: {
      title: '重定向',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
