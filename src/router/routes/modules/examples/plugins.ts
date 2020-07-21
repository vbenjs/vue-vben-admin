import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/plugins-demo';

const layout: LayoutType = {
  path: '/plugins-demo',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '插件',
    icon: 'home|svg',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/cache',
    name: 'CacheDemo',
    component: () => createAsyncComponent(import('@/views/examples/plugins/cache/CachePlugin.vue')),
    meta: {
      title: '持久化插件',
    },
  },
  {
    path: '/i18n',
    name: 'i18nDemo',
    component: () => createAsyncComponent(import('@/views/examples/plugins/i18n/index.vue')),
    meta: {
      title: '国际化插件',
    },
  },
  {
    path: '/qrcode',
    name: 'QrcodePlguinDemo',
    component: () => createAsyncComponent(import('@/views/examples/plugins/qrcode/index.vue')),
    meta: {
      title: '二维码插件',
    },
  },
  {
    path: '/context-menu-demo',
    name: 'ContextMenuDemo',
    component: () =>
      createAsyncComponent(import('@/views/examples/plugins/context-menu/index.vue')),
    meta: {
      title: '右键菜单',
    },
  },
  {
    path: '/preview-demo',
    name: 'PreviewDemo',
    component: () => createAsyncComponent(import('@/views/examples/plugins/preview/index.vue')),
    meta: {
      title: '图片预览插件',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
