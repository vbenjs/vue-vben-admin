import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 30,
  menu: {
    name: '插件',
    path: '/plugin',
    children: [
      {
        path: '/print',
        name: '打印插件',
      },
    ],
  },
};
export default menu;
