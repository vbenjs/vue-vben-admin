import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 1000,
  menu: {
    name: '外部页面',
    path: '/frame',
    children: [
      {
        path: '/antv',
        name: 'antVue文档(内嵌)',
      },
      {
        path: '/doc',
        name: '项目文档(内嵌)',
      },
      {
        path: '/docExternal',
        name: '项目文档(外链)',
      },
    ],
  },
};
export default menu;
