import type { MenuModule } from '/@/router/types.d';

const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: 'routes.demo.excel.excel',
    path: '/excel',
    children: [
      {
        path: 'customExport',
        name: 'routes.demo.excel.customExport',
      },
      {
        path: 'jsonExport',
        name: 'routes.demo.excel.jsonExport',
      },
      {
        path: 'arrayExport',
        name: 'routes.demo.excel.arrayExport',
      },
      {
        path: 'importExcel',
        name: 'routes.demo.excel.importExcel',
      },
    ],
  },
};
export default menu;
