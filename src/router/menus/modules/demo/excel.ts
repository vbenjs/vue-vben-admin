import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 500,
  menu: {
    name: 'Excel',
    path: '/excel',
    children: [
      {
        path: 'customExport',
        name: '选择导出格式',
      },
      {
        path: 'jsonExport',
        name: 'JSON数据导出',
      },
      {
        path: 'arrayExport',
        name: 'Array数据导出',
      },
      {
        path: 'importExcel',
        name: '导入',
      },
    ],
  },
};
export default menu;
