import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/components';

const layout: LayoutType = {
  path: '/components',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '组件',
    icon: 'home|svg',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/lazy-demo',
    name: 'LazyDemo',
    meta: {
      title: '懒加载组件',
    },
    children: [
      {
        path: '/base',
        name: 'LazyBaseDemo',
        component: () => createAsyncComponent(import('@/views/examples/components/lazy/Base.vue')),
        meta: {
          title: '基础示例',
        },
      },
      {
        path: '/timeout',
        name: 'LazyTimeOutDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/lazy/TimeOut.vue')),
        meta: {
          title: '延时加载示例',
        },
      },
      {
        path: '/transition',
        name: 'LazyTransitionDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/lazy/Transition.vue')),
        meta: {
          title: '过渡动画示例',
        },
      },
      {
        path: '/viewport',
        name: 'LazyViewportDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/lazy/Viewport.vue')),
        meta: {
          title: '特定视口内示例',
        },
      },
    ],
  },
  {
    path: '/scrollbar-demo',
    name: 'ScrollbarDemo',
    meta: {
      title: '滚动组件',
    },
    children: [
      {
        path: '/base',
        name: 'ScrollbarBaseDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/scrollbar/index.vue')),
        meta: {
          title: '基础示例',
        },
      },
    ],
  },
  {
    path: '/modal-demo',
    name: 'ModalDemo',
    meta: {
      title: '弹窗扩展',
    },
    component: () => createAsyncComponent(import('@/views/examples/components/modal/index.vue')),
  },
  {
    path: '/icon-demo',
    name: 'IconDemo',
    meta: {
      title: '图标',
    },
    component: () => createAsyncComponent(import('@/views/examples/components/icon/index.vue')),
  },
  {
    path: '/parallax-demo',
    name: 'ParallaxDemo',
    meta: {
      title: 'Parallax视差',
    },
    component: () => createAsyncComponent(import('@/views/examples/components/parallax/index.vue')),
  },
  {
    path: '/count-to-demo',
    name: 'CountToDemo',
    meta: {
      title: '数字动画',
    },
    component: () => createAsyncComponent(import('@/views/examples/components/count-to/index.vue')),
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
