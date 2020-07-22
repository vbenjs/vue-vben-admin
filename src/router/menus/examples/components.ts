import { NormMenuItem } from '@/router/types';

export const orderNo = 30;
export default {
  name: '组件',
  path: '/components',

  children: [
    {
      name: '基础组件',
      path: '/comp-base-demo',
    },
    {
      name: '表格组件',
      path: '/table-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
      ],
    },
    {
      name: '表单组件',
      path: '/form-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
        {
          name: '表单可收起示例',
          path: '/advance',
        },
        {
          name: '表单校验示例',
          path: '/validate',
        },
        {
          name: '动态表单示例',
          path: '/dynamic',
        },
        {
          name: '自定义组件示例',
          path: '/custom',
        },
      ],
    },
    {
      name: '懒加载组件',
      path: '/lazy-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
        {
          name: '延时加载示例',
          path: '/timeout',
        },
        {
          name: '过渡动画示例',
          path: '/transition',
        },
        {
          name: '特定视口内示例',
          path: '/viewport',
        },
      ],
    },
    {
      name: '滚动组件',
      path: '/scrollbar-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
        {
          name: '虚拟滚动组件',
          path: '/virtual-scroll',
        },
      ],
    },
    {
      name: '详情组件',
      path: '/desc-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
      ],
    },
    {
      name: '弹窗扩展',
      path: '/modal-demo',
    },
    {
      path: '/icon-demo',
      name: '图标',
    },
    {
      path: '/parallax-demo',
      name: 'Parallax视差',
    },
    {
      path: '/count-to-demo',
      name: '数字动画',
    },
    {
      path: '/transition-base-demo',
      name: '动画组件',
    },
    {
      path: '/click-out-side',
      name: 'clickOutSide组件',
    },
    {
      path: '/upload-image-demo',
      name: '上传图片',
    },
  ],
} as NormMenuItem;
