<script lang="ts" setup>
import { h, markRaw } from 'vue';

import { Input, message } from 'antdv-next';

import { useVbenForm } from '#/adapter/form';

interface CustomFormValues {
  componentType?: 'Input' | 'Select';
  dynamicField?: string;
  field?: string;
  field1?: string;
  field2?: string;
  field3?: string;
}

const dynamicOptions = [
  { label: '选项一', value: 'option-1' },
  { label: '选项二', value: 'option-2' },
];

const [Form] = useVbenForm<CustomFormValues>({
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
      component: 'Select',
      componentProps: {
        options: [
          { label: '输入框', value: 'Input' },
          { label: '选择器', value: 'Select' },
        ],
      },
      defaultValue: 'Input',
      fieldName: 'componentType',
      label: '动态组件类型',
    },
    {
      component: 'Input',
      dependencies: {
        resolve({ values }) {
          const isSelect = values.componentType === 'Select';
          return {
            component: isSelect ? 'Select' : 'Input',
            componentProps: isSelect
              ? { options: dynamicOptions, placeholder: '请选择' }
              : { placeholder: '请输入' },
          };
        },
        triggerFields: ['componentType'],
      },
      fieldName: 'dynamicField',
      label: '动态组件',
    },
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
      component: markRaw(Input),
      componentProps: {
        placeholder: '请输入',
      },
      fieldName: 'field2',
      label: '自定义组件',
      rules: 'required',
    },
    {
      component: 'Input',
      dependencies: {
        resolve({ values }) {
          const isSelect = values.componentType === 'Select';
          return {
            component: isSelect ? 'Select' : 'Input',
            componentProps: isSelect
              ? { options: dynamicOptions, placeholder: '请选择' }
              : { placeholder: '请输入' },
          };
        },
        triggerFields: ['componentType'],
      },
      fieldName: 'field3',
      label: '动态组件(slot)',
      rules: 'required',
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function onSubmit(values: Record<string, any>) {
  message.success({
    content: `form values: ${JSON.stringify(values)}`,
  });
}
</script>

<template>
  <Form>
    <template #field3="{ component, componentProps, values }">
      <component
        :is="component"
        v-bind="componentProps"
        :data-component-type="values.componentType"
      />
    </template>
  </Form>
</template>
