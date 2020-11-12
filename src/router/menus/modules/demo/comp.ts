import type { MenuModule } from '/@/router/types.d';
const menu: MenuModule = {
  orderNo: 30,
  menu: {
    name: '组件',
    path: '/comp',
    children: [
      {
        path: 'basic',
        name: '基础组件',
      },
      {
        path: 'countTo',
        name: '数字动画',
      },
      {
        path: 'transition',
        name: '动画组件',
      },

      {
        path: 'modal',
        name: '弹窗扩展',
      },
      {
        path: 'drawer',
        name: '抽屉扩展',
      },
      {
        path: 'desc',
        name: '详情组件',
      },
      {
        path: 'qrcode',
        name: '二维码组件',
      },
      {
        path: 'strength-meter',
        name: '密码强度组件',
      },
      // {
      //   path: 'upload',
      //   name: '上传组件',
      // },
      {
        path: 'scroll',
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
        path: 'lazy',
        name: '懒加载组件',
        children: [
          {
            path: 'basic',
            name: '基础示例',
          },
          {
            path: 'transition',
            name: '动画效果',
          },
        ],
      },
      {
        path: 'verify',
        name: '验证组件',
        children: [
          {
            path: 'drag',
            name: '拖拽校验',
          },
          {
            path: 'rotate',
            name: '图片还原校验',
          },
        ],
      },
      {
        path: '/form',
        name: '验证组件',
        children: [
          {
            path: '/base',
            name: '拖拽校验',
          },
        ],
      },
    ],
  },
};
export default menu;
