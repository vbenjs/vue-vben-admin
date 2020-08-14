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
      {
        path: '/demo8',
        name: 'TableBaseDemo8',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo8.vue')),
        meta: {
          title: '行拖拽',
        },
      },
      {
        path: '/demo9',
        name: 'TableBaseDemo9',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo9.vue')),
        meta: {
          title: '列拖拽',
        },
      },
      {
        path: '/demo10',
        name: 'TableBaseDemo10',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo10.vue')),
        meta: {
          title: '动态列示例',
        },
      },
      {
        path: '/demo11',
        name: 'TableBaseDemo11',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo11.vue')),
        meta: {
          title: '定高/头部自定义',
        },
      },
      {
        path: '/demo12',
        name: 'TableBaseDemo12',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo12.vue')),
        meta: {
          title: '展开行示例',
        },
      },
      {
        path: '/demo13',
        name: 'TableBaseDemo13',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo13.vue')),
        meta: {
          title: '合并行列示例',
        },
      },
      {
        path: '/demo14',
        name: 'TableBaseDemo14',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo14.vue')),
        meta: {
          title: '多级表头示例',
        },
      },
      {
        path: '/demo15',
        name: 'TableBaseDemo15',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo15.vue')),
        meta: {
          title: '可编辑单元格示例',
        },
      },
      {
        path: '/demo16',
        name: 'TableBaseDemo16',
        component: () => createAsyncComponent(import('@/views/examples/table/Demo16.vue')),
        meta: {
          title: '表尾行合计示例',
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
    path: '/tree-demo',
    name: 'TreeDemo',
    meta: {
      title: 'tree组件',
    },
    children: [
      {
        path: '/base',
        name: 'TreeBaseDemo',
        component: () => createAsyncComponent(import('@/views/examples/tree/index.vue')),
        meta: {
          title: '基础示例',
        },
      },
      {
        path: '/action',
        name: 'TreeActionDemo',
        component: () => createAsyncComponent(import('@/views/examples/tree/ActionDemo.vue')),
        meta: {
          title: '右键/按钮示例',
        },
      },
      {
        path: '/methods',
        name: 'TreeMethodsDemo',
        component: () => createAsyncComponent(import('@/views/examples/tree/Methods.vue')),
        meta: {
          title: '函数使用示例',
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
  // {
  //   path: '/upload-image-demo',
  //   name: 'UploadImageDemo',
  //   component: () =>
  //     createAsyncComponent(import('@/views/examples/components/file/UploadImage.vue')),
  //   meta: {
  //     title: '上传文件',
  //   },
  // },
  {
    path: '/file-demo',
    name: 'DescDemo',
    meta: {
      title: '上传下载',
    },
    children: [
      {
        path: '/upload',
        name: 'UploadImageDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/file/UploadImage.vue')),
        meta: {
          title: '上传',
        },
      },
      {
        path: '/download',
        name: 'DownloadFileDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/file/DownloadFile.vue')),
        meta: {
          title: '下载',
        },
      },
    ],
  },
  {
    path: '/strength-meter-demo',
    name: 'StrengthDemo',
    component: () =>
      createAsyncComponent(import('@/views/examples/components/strength-meter/index.vue')),
    meta: {
      title: '密码强度校验',
    },
  },
  {
    path: '/verify-demo',
    name: 'VerifyDemo',
    meta: {
      title: '验证码组件',
    },
    children: [
      {
        path: '/base-drag',
        name: 'BaseDragVerifyDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/verify/Base.vue')),
        meta: {
          title: '拖拽验证',
        },
      },
      {
        path: '/rotate-drag',
        name: 'RotateDragVerifyDemo',
        component: () =>
          createAsyncComponent(import('@/views/examples/components/verify/Rotate.vue')),
        meta: {
          title: '旋转拖拽验证',
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
