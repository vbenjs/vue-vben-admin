import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/error-log';

const layout: LayoutType = {
  path: '/error-log',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: 'ErrorLog',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/index',
    name: 'ErrorHandler',
    component: () => createAsyncComponent(import('@/views/sys/error-log/index.vue')),
    meta: {
      icon: 'bug',
      title: '错误日志',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
