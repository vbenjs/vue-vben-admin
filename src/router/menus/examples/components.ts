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
          path: '/demo1',
        },
        {
          name: '自适应高度示例',
          path: '/demo2',
        },
        {
          name: '树型表格示例',
          path: '/demo3',
        },
        {
          name: '远程加载示例',
          path: '/demo4',
        },
        {
          name: '固定列示例',
          path: '/demo5',
        },
        {
          name: '自定义列示例',
          path: '/demo6',
        },
        {
          name: '开启搜索区域',
          path: '/demo7',
        },
        {
          name: '行拖拽',
          path: '/demo8',
        },
        {
          name: '列拖拽',
          path: '/demo9',
        },
        {
          name: '动态列示例',
          path: '/demo10',
        },
        {
          name: '定高/头部自定义',
          path: '/demo11',
        },
        {
          name: '展开行示例',
          path: '/demo12',
        },
        {
          name: '合并行列示例',
          path: '/demo13',
        },
        {
          name: '多级表头示例',
          path: '/demo14',
        },
        {
          name: '可编辑单元格示例',
          path: '/demo15',
        },
        {
          name: '表尾行合计示例',
          path: '/demo16',
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
      name: 'tree组件',
      path: '/tree-demo',
      children: [
        {
          name: '基础示例',
          path: '/base',
        },
        {
          name: '右键/按钮示例',
          path: '/action',
        },
        {
          name: '函数使用示例',
          path: '/methods',
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
      path: '/verify-demo',
      name: '验证码组件',
      children: [
        {
          name: '拖拽验证',
          path: '/base-drag',
        },
        {
          name: '旋转拖拽验证',
          path: '/rotate-drag',
        },
      ],
    },
    {
      name: '上传下载',
      path: '/file-demo',
      children: [
        {
          name: '上传',
          path: '/upload',
        },
        {
          name: '下载',
          path: '/download',
        },
      ],
    },
  ],
} as NormMenuItem;
