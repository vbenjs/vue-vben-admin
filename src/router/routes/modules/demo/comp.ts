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
      path: '/icon',
      name: 'IconDemo',
      component: () => import('/@/views/demo/comp/icon/index.vue'),
      meta: {
        title: '图标',
      },
    },
    // form
    {
      path: '/form',
      name: 'FormDemo',
      redirect: '/comp/form/basic',
      meta: {
        title: '表单组件',
      },
      children: [
        {
          path: 'basic',
          name: 'FormBasicDemo',
          component: () => import('/@/views/demo/form/index.vue'),
          meta: {
            title: '基础表单',
          },
        },
        {
          path: 'useForm',
          name: 'UseFormDemo',
          component: () => import('/@/views/demo/form/UseForm.vue'),
          meta: {
            title: 'useForm',
          },
        },
        {
          path: 'refForm',
          name: 'RefFormDemo',
          component: () => import('/@/views/demo/form/RefForm.vue'),
          meta: {
            title: 'RefForm',
          },
        },
        {
          path: 'advancedForm',
          name: 'AdvancedFormDemo',
          component: () => import('/@/views/demo/form/AdvancedForm.vue'),
          meta: {
            title: '可收缩表单',
          },
        },
        {
          path: 'ruleForm',
          name: 'RuleFormDemo',
          component: () => import('/@/views/demo/form/RuleForm.vue'),
          meta: {
            title: '表单验证',
          },
        },
        {
          path: 'dynamicForm',
          name: 'DynamicFormDemo',
          component: () => import('/@/views/demo/form/DynamicForm.vue'),
          meta: {
            title: '动态表单',
          },
        },
        {
          path: 'customerForm',
          name: 'CustomerFormDemo',
          component: () => import('/@/views/demo/form/CustomerForm.vue'),
          meta: {
            title: '自定义组件',
          },
        },
      ],
    },
    {
      path: '/table',
      name: 'TableDemo',
      redirect: '/comp/table/basic',
      meta: {
        title: '表格组件',
      },
      children: [
        {
          path: 'basic',
          name: 'TableBasicDemo',
          component: () => import('/@/views/demo/table/Basic.vue'),
          meta: {
            title: '基础表格',
          },
        },
        {
          path: 'treeTable',
          name: 'TreeTableDemo',
          component: () => import('/@/views/demo/table/TreeTable.vue'),
          meta: {
            title: '树形表格',
          },
        },
        {
          path: 'fetchTable',
          name: 'FetchTableDemo',
          component: () => import('/@/views/demo/table/FetchTable.vue'),
          meta: {
            title: '远程加载示例',
          },
        },
        {
          path: 'fixedColumn',
          name: 'FixedColumnDemo',
          component: () => import('/@/views/demo/table/FixedColumn.vue'),
          meta: {
            title: '固定列',
          },
        },
        {
          path: 'customerCell',
          name: 'CustomerCellDemo',
          component: () => import('/@/views/demo/table/CustomerCell.vue'),
          meta: {
            title: '自定义列',
          },
        },
        {
          path: 'formTable',
          name: 'FormTableDemo',
          component: () => import('/@/views/demo/table/FormTable.vue'),
          meta: {
            title: '开启搜索区域',
          },
        },
        {
          path: 'useTable',
          name: 'UseTableDemo',
          component: () => import('/@/views/demo/table/UseTable.vue'),
          meta: {
            title: 'UseTable',
          },
        },
        {
          path: 'refTable',
          name: 'RefTableDemo',
          component: () => import('/@/views/demo/table/RefTable.vue'),
          meta: {
            title: 'RefTable',
          },
        },
        {
          path: 'multipleHeader',
          name: 'MultipleHeaderDemo',
          component: () => import('/@/views/demo/table/MultipleHeader.vue'),
          meta: {
            title: '多级表头',
          },
        },
        {
          path: 'mergeHeader',
          name: 'MergeHeaderDemo',
          component: () => import('/@/views/demo/table/MergeHeader.vue'),
          meta: {
            title: '合并表头',
          },
        },
        {
          path: 'expandTable',
          name: 'ExpandTableDemo',
          component: () => import('/@/views/demo/table/ExpandTable.vue'),
          meta: {
            title: '可展开表格',
          },
        },
        {
          path: 'fixedHeight',
          name: 'FixedHeightDemo',
          component: () => import('/@/views/demo/table/FixedHeight.vue'),
          meta: {
            title: '定高/头部自定义',
          },
        },
        {
          path: 'footerTable',
          name: 'FooterTableDemo',
          component: () => import('/@/views/demo/table/FooterTable.vue'),
          meta: {
            title: '表尾行合计',
          },
        },
        {
          path: 'editCellTable',
          name: 'EditCellTableDemo',
          component: () => import('/@/views/demo/table/EditCellTable.vue'),
          meta: {
            title: '可编辑单元格',
          },
        },
      ],
    },
    {
      path: '/tree',
      name: 'TreeDemo',
      redirect: '/comp/tree/basic',
      meta: {
        title: '树组件',
      },
      children: [
        {
          path: 'basic',
          name: 'BasicTreeDemo',
          component: () => import('/@/views/demo/tree/index.vue'),
          meta: {
            title: '基础树',
          },
        },
        {
          path: 'editTree',
          name: 'EditTreeDemo',
          component: () => import('/@/views/demo/tree/EditTree.vue'),
          meta: {
            title: '右键示例',
          },
        },
        {
          path: 'actionTree',
          name: 'ActionTreeDemo',
          component: () => import('/@/views/demo/tree/ActionTree.vue'),
          meta: {
            title: '函数操作示例',
          },
        },
      ],
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
      path: '/click-out-side',
      name: 'ClickOutSideDemo',
      component: () => import('/@/views/demo/comp/click-out-side/index.vue'),
      meta: {
        title: 'ClickOutSide组件',
      },
    },
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
