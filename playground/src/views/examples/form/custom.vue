<script lang="ts" setup>
import { h } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';

const [Form] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelClass: 'w-2/6',
  },
  // 提交函数
  handleSubmit: onSubmit,
  // 垂直布局，label和input在不同行，值为vertical
  // 水平布局，label和input在同一行
  layout: 'horizontal',
  schema: [
    {
      // 组件需要在 #/adapter.ts内注册，并加上类型
      component: 'Input',
      fieldName: 'field',
      label: '自定义后缀',
      suffix: () => h('span', { class: 'text-red-600' }, '元'),
    },
    {
      component: 'Input',
      fieldName: 'field1',
      label: '自定义组件slot',
      renderComponentContent: () => ({
        prefix: () => 'prefix',
        suffix: () => 'suffix',
      }),
    },
    {
      component: h(Input, { placeholder: '请输入' }),
      fieldName: 'field2',
      label: '自定义组件',
      rules: 'required',
    },
    {
      component: 'Input',
      fieldName: 'field3',
      label: '自定义组件(slot)',
      rules: 'required',
    },
  ],
  // 中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page description="表单组件自定义示例" title="表单组件">
    <Card title="基础示例">
      <Form>
        <template #field3="slotProps">
          <Input placeholder="请输入" v-bind="slotProps" />
        </template>
      </Form>
    </Card>
  </Page>
</template>
