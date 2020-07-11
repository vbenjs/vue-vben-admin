import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/type';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/feat';

const layout: LayoutType = {
  path: prefix,
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '页面功能',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/multiple-tabs',
    name: 'MultipleTabs',
    component: () =>
      createAsyncComponent(import('@/views/examples/features/multiple-tabs/index.vue')),
    meta: {
      title: '标签页操作',
    },
  },
  {
    path: '/copy',
    name: 'Copy',
    component: () => createAsyncComponent(import('@/views/examples/features/copy/index.vue')),
    meta: {
      title: '剪切板',
    },
  },
  {
    path: '/watermark',
    name: 'Watermark',
    component: () => createAsyncComponent(import('@/views/examples/features/watermark/index.vue')),
    meta: {
      title: '水印',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
