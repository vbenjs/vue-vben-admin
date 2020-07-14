import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/plugins';

const layout: LayoutType = {
  path: '/plugins',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '插件',
    icon: 'home|svg',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/cache',
    name: 'Cache',
    component: () => createAsyncComponent(import('@/views/examples/plugins/cache/CachePlugin.vue')),
    meta: {
      title: '持久化插件',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
