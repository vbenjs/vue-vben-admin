import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 30,
  menu: {
    name: '组件',
    path: '/comp',
    children: [
      {
        path: '/basic',
        name: '基础组件',
      },
      {
        path: '/icon',
        name: '图标',
      },
      {
        path: '/click-out-side',
        name: 'ClickOutSide组件',
      },
      {
        path: '/table',
        name: '表格组件',
        children: [
          {
            path: '/basic',
            name: '基础表格',
          },
          {
            path: '/treeTable',
            name: '树形表格',
          },
          {
            path: '/fetchTable',
            name: '远程加载',
          },
          {
            path: '/fixedColumn',
            name: '固定列',
          },
          {
            path: '/customerCell',
            name: '自定义列',
          },
          {
            path: '/formTable',
            name: '开启搜索区域',
          },
          {
            path: '/useTable',
            name: 'UseTable',
          },
          {
            path: '/refTable',
            name: 'RefTable',
          },
          {
            path: '/multipleHeader',
            name: '多级表头',
          },
          {
            path: '/mergeHeader',
            name: '合并单元格',
          },
          {
            path: '/expandTable',
            name: '可展开表格',
          },
          {
            path: '/fixedHeight',
            name: '定高/头部自定义',
          },
          {
            path: '/footerTable',
            name: '表尾行合计',
          },
          {
            path: '/editCellTable',
            name: '可编辑单元格',
          },
        ],
      },
      {
        path: '/form',
        name: '表单组件',
        children: [
          {
            path: '/basic',
            name: '基础表单',
          },
          {
            path: '/useForm',
            name: 'useForm',
          },
          {
            path: '/refForm',
            name: 'RefForm',
          },
          {
            path: '/advancedForm',
            name: '可收缩表单',
          },
          {
            path: '/ruleForm',
            name: '表单校验',
          },
          {
            path: '/dynamicForm',
            name: '动态表单',
          },
          {
            path: '/customerForm',
            name: '自定义组件',
          },
        ],
      },
      {
        path: '/tree',
        name: '树组件',
        children: [
          {
            path: 'basic',
            name: '基础示例',
          },
          {
            path: 'editTree',
            name: '右键示例',
          },
          {
            path: 'actionTree',
            name: '函数操作示例',
          },
        ],
      },
      {
        path: '/scroll',
        name: '滚动组件',
        children: [
          {
            path: 'basic',
            name: '基础示例',
          },
          {
            path: 'action',
            name: '函数操作示例',
          },
          {
            path: 'virtualScroll',
            name: '虚拟滚动',
          },
        ],
      },
      {
        path: '/modal',
        name: '弹窗扩展',
      },
      {
        path: '/drawer',
        name: '抽屉扩展',
      },
      {
        path: '/desc',
        name: '详情组件',
      },
      {
        path: '/verify',
        name: '验证组件',
        children: [
          {
            path: '/drag',
            name: '拖拽校验',
          },
          {
            path: '/rotate',
            name: '图片还原校验',
          },
        ],
      },
      {
        path: '/qrcode',
        name: '二维码组件',
      },
      {
        path: '/strength-meter',
        name: '密码强度组件',
      },
    ],
  },
};
export default menu;
