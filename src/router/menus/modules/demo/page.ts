import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 20,
  menu: {
    name: 'routes.demo.page.page',
    path: '/page-demo',
    tag: {
      dot: true,
    },
    children: [
      {
        path: 'form',
        name: 'routes.demo.page.form',

        children: [
          {
            path: 'basic',
            name: 'routes.demo.page.formBasic',
          },
          {
            path: 'step',
            name: 'routes.demo.page.formStep',
          },
          {
            path: 'high',
            name: 'routes.demo.page.formHigh',
          },
        ],
      },
      {
        path: 'desc',
        name: 'routes.demo.page.desc',

        children: [
          {
            path: 'basic',
            name: 'routes.demo.page.descBasic',
          },
          {
            path: 'high',
            name: 'routes.demo.page.descHigh',
          },
        ],
      },
      {
        path: 'result',
        name: 'routes.demo.page.result',

        children: [
          {
            path: 'success',
            name: 'routes.demo.page.resultSuccess',
          },
          {
            path: 'fail',
            name: 'routes.demo.page.resultFail',
          },
        ],
      },
      {
        path: 'exception',
        name: 'routes.demo.page.exception',
        children: [
          {
            path: '403',
            name: '403',
          },
          {
            path: '404',
            name: '404',
          },
          {
            path: '500',
            name: '500',
          },
          {
            path: 'net-work-error',
            name: 'routes.demo.page.netWorkError',
          },
          {
            path: 'not-data',
            name: 'routes.demo.page.notData',
          },
        ],
      },
      {
        path: 'account',
        name: 'routes.demo.page.account',
        children: [
          {
            path: 'center',
            name: 'routes.demo.page.accountCenter',
          },
          {
            path: 'setting',
            name: 'routes.demo.page.accountSetting',
          },
        ],
      },
      {
        path: 'list',
        name: 'routes.demo.page.list',
        tag: {
          content: 'new',
        },
        children: [
          {
            path: 'card',
            name: 'routes.demo.page.listCard',
          },
        ],
      },
    ],
  },
};
export default menu;
