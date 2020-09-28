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
