<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { useVbenForm } from '#/adapter';

const [QueryForm] = useVbenForm({
  // 默认展开
  collapsed: false,
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
  },
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      // 对应组件的参数
      componentProps: {
        placeholder: '请输入用户名',
      },
      // 字段名
      fieldName: 'username',
      // 界面显示的label
      label: '字符串',
    },
  ],
  // 是否可展开
  showCollapseButton: true,
  submitButtonOptions: {
    content: '查询',
  },
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
});
</script>

<template>
  <Page
    description="查询表单，常用语和表格组合使用，可进行收缩展开。"
    title="表单组件"
  >
    <QueryForm />
  </Page>
</template>
