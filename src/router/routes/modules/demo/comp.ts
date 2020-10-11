import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

export default {
  layout: {
    path: '/comp',
    name: 'Comp',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/comp/basic',
    meta: {
      icon: 'ant-design:table-outlined',
      title: '组件',
    },
  },

  routes: [
    {
      path: '/basic',
      name: 'BasicDemo',
      component: () => import('/@/views/demo/comp/button/index.vue'),
      meta: {
        title: '基础组件',
      },
    },
    {
      path: '/countTo',
      name: 'CountTo',
      component: () => import('/@/views/demo/comp/count-to/index.vue'),
      meta: {
        title: '数字动画',
      },
    },

    {
      path: '/scroll',
      name: 'ScrollDemo',
      redirect: '/comp/scroll/basic',
      meta: {
        title: '滚动组件',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicScrollDemo',
          component: () => import('/@/views/demo/comp/scroll/index.vue'),
          meta: {
            title: '基础滚动',
          },
        },
        {
          path: 'action',
          name: 'ActionScrollDemo',
          component: () => import('/@/views/demo/comp/scroll/Action.vue'),
          meta: {
            title: '滚动函数',
          },
        },
        {
          path: 'virtualScroll',
          name: 'VirtualScrollDemo',
          component: () => import('/@/views/demo/comp/scroll/VirtualScroll.vue'),
          meta: {
            title: '虚拟滚动',
          },
        },
      ],
    },

    {
      path: '/modal',
      name: 'ModalDemo',
      component: () => import('/@/views/demo/comp/modal/index.vue'),
      meta: {
        title: '弹窗扩展',
      },
    },
    {
      path: '/drawer',
      name: 'DrawerDemo',
      component: () => import('/@/views/demo/comp/drawer/index.vue'),
      meta: {
        title: '抽屉扩展',
      },
    },
    {
      path: '/desc',
      name: 'DescDemo',
      component: () => import('/@/views/demo/comp/desc/index.vue'),
      meta: {
        title: '详情组件',
      },
    },

    {
      path: '/verify',
      name: 'VerifyDemo',
      redirect: '/comp/verify/drag',
      meta: {
        title: '验证组件',
      },
      children: [
        {
          path: 'drag',
          name: 'VerifyDragDemo',
          component: () => import('/@/views/demo/comp/verify/index.vue'),
          meta: {
            title: '拖拽校验',
          },
        },
        {
          path: 'rotate',
          name: 'VerifyRotateDemo',
          component: () => import('/@/views/demo/comp/verify/Rotate.vue'),
          meta: {
            title: '图片还原',
          },
        },
      ],
    },
    //

    {
      path: '/qrcode',
      name: 'QrCodeDemo',
      component: () => import('/@/views/demo/comp/qrcode/index.vue'),
      meta: {
        title: '二维码组件',
      },
    },
    {
      path: '/strength-meter',
      name: 'StrengthMeterDemo',
      component: () => import('/@/views/demo/comp/strength-meter/index.vue'),
      meta: {
        title: '密码强度组件',
      },
    },
  ],
} as AppRouteModule;
