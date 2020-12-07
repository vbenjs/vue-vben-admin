import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 1000,
  menu: {
    name: 'routes.demo.iframe.frame',
    path: '/frame',
    children: [
      {
        path: 'antv',
        name: 'routes.demo.iframe.antv',
      },
      {
        path: 'doc',
        name: 'routes.demo.iframe.doc',
      },
      {
        path: 'https://vvbin.cn/doc-next/',
        name: 'routes.demo.iframe.docExternal',
      },
    ],
  },
};
export default menu;
