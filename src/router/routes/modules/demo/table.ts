import type { AppRouteModule } from '/@/router/types';

import { PAGE_LAYOUT_COMPONENT } from '/@/router/constant';

const table: AppRouteModule = {
  layout: {
    path: '/table',
    name: 'TableDemo',
    component: PAGE_LAYOUT_COMPONENT,
    redirect: '/table/basic',
    meta: {
      icon: 'ant-design:table-outlined',
      title: 'Table',
    },
  },

  routes: [
    {
      path: '/basic',
      name: 'TableBasicDemo',
      component: () => import('/@/views/demo/table/Basic.vue'),
      meta: {
        title: '基础表格',
      },
    },
    {
      path: '/treeTable',
      name: 'TreeTableDemo',
      component: () => import('/@/views/demo/table/TreeTable.vue'),
      meta: {
        title: '树形表格',
      },
    },
    {
      path: '/fetchTable',
      name: 'FetchTableDemo',
      component: () => import('/@/views/demo/table/FetchTable.vue'),
      meta: {
        title: '远程加载示例',
      },
    },
    {
      path: '/fixedColumn',
      name: 'FixedColumnDemo',
      component: () => import('/@/views/demo/table/FixedColumn.vue'),
      meta: {
        title: '固定列',
      },
    },
    {
      path: '/customerCell',
      name: 'CustomerCellDemo',
      component: () => import('/@/views/demo/table/CustomerCell.vue'),
      meta: {
        title: '自定义列',
      },
    },
    {
      path: '/formTable',
      name: 'FormTableDemo',
      component: () => import('/@/views/demo/table/FormTable.vue'),
      meta: {
        title: '开启搜索区域',
      },
    },
    {
      path: '/useTable',
      name: 'UseTableDemo',
      component: () => import('/@/views/demo/table/UseTable.vue'),
      meta: {
        title: 'UseTable',
      },
    },
    {
      path: '/refTable',
      name: 'RefTableDemo',
      component: () => import('/@/views/demo/table/RefTable.vue'),
      meta: {
        title: 'RefTable',
      },
    },
    {
      path: '/multipleHeader',
      name: 'MultipleHeaderDemo',
      component: () => import('/@/views/demo/table/MultipleHeader.vue'),
      meta: {
        title: '多级表头',
      },
    },
    {
      path: '/mergeHeader',
      name: 'MergeHeaderDemo',
      component: () => import('/@/views/demo/table/MergeHeader.vue'),
      meta: {
        title: '合并单元格',
      },
    },
    {
      path: '/expandTable',
      name: 'ExpandTableDemo',
      component: () => import('/@/views/demo/table/ExpandTable.vue'),
      meta: {
        title: '可展开表格',
      },
    },
    {
      path: '/fixedHeight',
      name: 'FixedHeightDemo',
      component: () => import('/@/views/demo/table/FixedHeight.vue'),
      meta: {
        title: '定高/头部自定义',
      },
    },
    {
      path: '/footerTable',
      name: 'FooterTableDemo',
      component: () => import('/@/views/demo/table/FooterTable.vue'),
      meta: {
        title: '表尾行合计',
      },
    },
    {
      path: '/editCellTable',
      name: 'EditCellTableDemo',
      component: () => import('/@/views/demo/table/EditCellTable.vue'),
      meta: {
        title: '可编辑单元格',
      },
    },
  ],
};

export default table;
