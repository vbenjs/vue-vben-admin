<script lang="ts" setup>
import { h } from 'vue';

import { Page } from '@vben/common-ui';

import { Card, Input, message } from 'ant-design-vue';

import { useVbenForm } from '#/adapter/form';
import { getBase64Img } from '#/views/examples/form/costom-sub/img.data';

import GraphValidateCode from './costom-sub/graph-validate-code.vue';

const getImgApi = () => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(getBase64Img());
    }, 500);
  });
};

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
  ],
  // 中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 ',
});
const [FormCustom] = useVbenForm({
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full ',
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
      label: '是用前后缀slot',
      renderComponentContent: () => ({
        prefix: () => 'prefix',
        suffix: () => 'suffix',
      }),
    },
    {
      component: 'Input',
      componentProps: {
        api: getImgApi,
      },
      fieldName: 'code',
      label: '自定义组件(slot)',
      rules: 'required',
    },
  ],
  // 中屏一行显示2个，小屏一行显示1个
  wrapperClass: 'grid-cols-1 md:grid-cols-2 ',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Page description="表单组件自定义示例" title="表单组件">
    <Card class="mb-[20px]" title="基础示例">
      <Form>
        <template #field3="slotProps">
          <Input placeholder="请输入" v-bind="slotProps" />
        </template>
      </Form>
    </Card>
    <Card title="自定义插槽示例">
      <FormCustom>
        <template #code="props">
          <GraphValidateCode
            :prop-api="props.api"
            :prop-validate-failed="props.isInValid"
            :value="props.value"
            @on-emit-on-blur="props.handleBlur()"
            @on-emit-on-change="props.handleChange($event)"
            @on-emit-on-focus="() => {}"
            @update:value="(nV) => props.setValue(nV)"
          />
        </template>
      </FormCustom>
    </Card>
  </Page>
</template>
