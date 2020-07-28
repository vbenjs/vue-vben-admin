import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/plugins-demo';

const layout: LayoutType = {
  path: '/plugins-demo',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '插件',
    icon: 'project',
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
  {
    path: '/tinymce',
    name: 'TinymceDemo',
    component: () => createAsyncComponent(import('@/views/examples/plugins/tinymce/index.vue')),
    meta: {
      title: '富文本编辑器',
    },
  },
  {
    path: '/print',
    name: 'PrintDemo',
    meta: {
      title: '打印插件',
    },
    children: [
      {
        path: '/base',
        name: 'PrintBaseDemo',
        component: () => createAsyncComponent(import('@/views/examples/plugins/print/index.vue')),
        meta: {
          title: '基础打印示例',
        },
      },
      {
        path: '/json',
        name: 'PrintJsonDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/plugins/print/JsonPrint.vue')),
        meta: {
          title: '打印Json示例',
        },
      },
    ],
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
