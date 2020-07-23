import { RouteConfigEx, LayoutType, ModuleRouteConfig } from '@/router/types';

import { createAsyncComponent } from '@/common/factory/AsyncComponentFactory';
import { PAGE_LAYOUT_COMPONENT } from '@/router/constant';

const prefix = '/components';

const layout: LayoutType = {
  path: '/components',
  component: PAGE_LAYOUT_COMPONENT,
  meta: {
    title: '组件',
    icon: 'switcher',
  },
};

const routes: RouteConfigEx[] = [
  {
    path: '/comp-base-demo',
    name: 'CompBaseDemo',
    component: () => createAsyncComponent(import('@/views/examples/components/index.vue')),
    meta: {
      title: '基础组件',
    },
  },
  {
    path: '/table-demo',
    name: 'TableDemo',
    meta: {
      title: '表格组件',
    },
    children: [
      {
        path: '/demo1',
        name: 'TableBaseDemo1',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo1.vue')),
        meta: {
          title: '表格基础示例',
        },
      },
      {
        path: '/demo2',
        name: 'TableBaseDemo2',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo2.vue')),
        meta: {
          title: '自适应高度示例',
        },
      },
      {
        path: '/demo3',
        name: 'TableBaseDemo3',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo3.vue')),
        meta: {
          title: '树型表格示例',
        },
      },
      {
        path: '/demo4',
        name: 'TableBaseDemo4',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo4.vue')),
        meta: {
          title: '远程加载示例',
        },
      },
      {
        path: '/demo5',
        name: 'TableBaseDemo5',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo5.vue')),
        meta: {
          title: '固定列示例',
        },
      },
      {
        path: '/demo6',
        name: 'TableBaseDemo6',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo6.vue')),
        meta: {
          title: '自定义列示例',
        },
      },
      {
        path: '/demo7',
        name: 'TableBaseDemo7',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo7.vue')),
        meta: {
          title: '开启搜索区域',
        },
      },
    ],
  },
  {
    path: '/form-demo',
    name: 'FormDemo',
    meta: {
      title: '表单组件',
    },
    children: [
      {
        path: '/base',
        name: 'FormBaseDemo',
        component: () => createAsyncComponent(import('@/views/examples/form/Base.vue')),
        meta: {
          title: '表单基础示例',
        },
      },
      {
        path: '/advance',
        name: 'FormAdvanceDemo',
        component: () => createAsyncComponent(import('@/views/examples/form/Advance.vue')),
        meta: {
          title: '表单可收起示例',
        },
      },
      {
        path: '/validate',
        name: 'FormValidateDemo',
        component: () => createAsyncComponent(import('@/views/examples/form/Validate.vue')),
        meta: {
          title: '表单校验示例',
        },
      },
      {
        path: '/dynamic',
        name: 'FormDynamicDemo',
        component: () => createAsyncComponent(import('@/views/examples/form/Dynamic.vue')),
        meta: {
          title: '动态表单示例',
        },
      },
      {
        path: '/custom',
        name: 'FormCustomDemo',
        component: () => createAsyncComponent(import('@/views/examples/form/CustomComp.vue')),
        meta: {
          title: '自定义表单示例',
        },
      },
    ],
  },
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
      {
        path: '/virtual-scroll',
        name: 'VirtualScrollDemo',
        meta: {
          title: '虚拟滚动组件',
        },
        component: () =>
          createAsyncComponent(import('@/views/examples/components/virtual-scroll/index.vue')),
      },
    ],
  },
  {
    path: '/desc-demo',
    name: 'DescDemo',
    meta: {
      title: '详情组件',
    },
    children: [
      {
        path: '/base',
        name: 'DescBaseDemo',
        component: () => createAsyncComponent(import('@/views/examples/components/desc/index.vue')),
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
  {
    path: '/transition-base-demo',
    name: 'TransitionBaseDemo',
    component: () => createAsyncComponent(import('@/views/examples/transition/index.vue')),
    meta: {
      title: '动画组件',
    },
  },
  {
    path: '/click-out-side',
    name: 'ClickOutSideDemo',
    component: () =>
      createAsyncComponent(import('@/views/examples/components/click-out-side/index.vue')),
    meta: {
      title: 'clickOutSide组件',
    },
  },
  {
    path: '/upload-image-demo',
    name: 'UploadImageDemo',
    component: () =>
      createAsyncComponent(import('@/views/examples/components/upload/UploadImage.vue')),
    meta: {
      title: '上传图片',
    },
  },
];

export default {
  routes: routes,
  prefix,
  layout,
} as ModuleRouteConfig;
