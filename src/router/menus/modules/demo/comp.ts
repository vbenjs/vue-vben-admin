import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 30,
  menu: {
    name: 'routes.demo.comp.comp',
    path: '/comp',

    children: [
      {
        path: 'basic',
        name: 'routes.demo.comp.basic',
      },
      {
        path: 'countTo',
        name: 'routes.demo.comp.countTo',
      },
      {
        path: 'transition',
        name: 'routes.demo.comp.transition',
      },

      {
        path: 'modal',
        name: 'routes.demo.comp.modal',
      },
      {
        path: 'drawer',
        name: 'routes.demo.comp.drawer',
      },
      {
        path: 'desc',
        name: 'routes.demo.comp.desc',
      },
      {
        path: 'qrcode',
        name: 'routes.demo.comp.qrcode',
      },
      {
        path: 'strength-meter',
        name: 'routes.demo.comp.strength',
      },
      {
        path: 'upload',
        name: 'routes.demo.comp.upload',
      },
      {
        path: 'loading',
        name: 'routes.demo.comp.loading',
      },
      {
        path: 'scroll',
        name: 'routes.demo.comp.scroll',
        children: [
          {
            path: 'basic',
            name: 'routes.demo.comp.scrollBasic',
          },
          {
            path: 'action',
            name: 'routes.demo.comp.scrollAction',
          },
          {
            path: 'virtualScroll',
            name: 'routes.demo.comp.virtualScroll',
          },
        ],
      },
      {
        path: 'lazy',
        name: 'routes.demo.comp.lazy',
        children: [
          {
            path: 'basic',
            name: 'routes.demo.comp.lazyBasic',
          },
          {
            path: 'transition',
            name: 'routes.demo.comp.lazyTransition',
          },
        ],
      },
      {
        path: 'verify',
        name: 'routes.demo.comp.verify',
        children: [
          {
            path: 'drag',
            name: 'routes.demo.comp.verifyDrag',
          },
          {
            path: 'rotate',
            name: 'routes.demo.comp.verifyRotate',
          },
        ],
      },
    ],
  },
};
export default menu;
