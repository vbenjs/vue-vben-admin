import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/type';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/test';

const layout: LayoutType = {
  path: prefix,
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '测试页',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/test1',
    name: 'Test1',
    component: () => createAsyncComponent(import('@/views/test/test1.vue')),
    meta: {
      title: '测试页1',
    },
  },
  {
    path: '/test2',
    name: 'Test2',
    component: () => createAsyncComponent(import('@/views/test/test2.vue')),
    meta: {
      title: '测试页2',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
