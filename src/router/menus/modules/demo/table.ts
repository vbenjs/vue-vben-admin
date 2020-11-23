import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 30,
  menu: {
    path: '/table',
    name: 'Table',
    children: [
      {
        path: 'basic',
        name: '基础表格',
      },
      {
        path: 'treeTable',
        name: '树形表格',
      },
      {
        path: 'fetchTable',
        name: '远程加载',
      },
      {
        path: 'fixedColumn',
        name: '固定列',
      },
      {
        path: 'customerCell',
        name: '自定义列',
      },
      {
        path: 'formTable',
        name: '开启搜索区域',
      },
      {
        path: 'useTable',
        name: 'UseTable',
      },
      {
        path: 'refTable',
        name: 'RefTable',
      },
      {
        path: 'multipleHeader',
        name: '多级表头',
      },
      {
        path: 'mergeHeader',
        name: '合并单元格',
      },
      {
        path: 'expandTable',
        name: '可展开表格',
      },
      {
        path: 'fixedHeight',
        name: '定高/头部自定义',
      },
      {
        path: 'footerTable',
        name: '表尾行合计',
      },
      {
        path: 'editCellTable',
        name: '可编辑单元格',
      },
      {
        path: 'editRowTable',
        name: '可编辑行',
      },
    ],
  },
};
export default menu;
