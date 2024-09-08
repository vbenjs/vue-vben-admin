<script lang="ts" setup>
import { Page } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

import { useVbenForm, z } from '#/adapter';

const [Form] = useVbenForm({
  // 使用 tailwindcss grid布局
  // 大屏一行显示3个，中屏一行显示2个，小屏一行显示1个
  gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  // 提交函数
  handleSubmit: onSubmit,
  // 水平布局，label和input在同一行
  // 垂直布局，label和input在不同行，值为vertical
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入用户名',
      },
      dependencies: {
        required: (values) => {
          return values.password === '123';
        },
        // rules: (values) => {
        //   if (values.password === '123') {
        //     return z.string().min(1);
        //   }
        //   return z.string().min(1).optional();
        // },
        triggerFields: ['password', 'username1'],
      },
      fieldName: 'username',
      label: 'Username',
      // layout: 'horizontal',
      rules: z.string().min(1).optional(),
    },
    {
      component: 'InputPassword',
      fieldName: 'password',
      help: '123',
      // layout: 'vertical',
      label: 'Password',
      // layout: 'horizontal',
      rules: z.string().min(1),
    },
    {
      component: 'Select',
      componentProps: (values) => {
        if (values.password === '123') {
          return {
            options: [
              {
                label: '选项1',
                value: '1',
              },
              {
                label: '选项2',
                value: '2',
              },
            ],
            placeholder: '请选择',
          };
        }
        return {
          options: [
            {
              label: '选项1',
              value: '1',
            },
          ],
          placeholder: '请选择',
        };
      },
      dependencies: {
        // componentProps: (values) => {
        //   if (values.password === '123') {
        //     return {
        //       options: [
        //         {
        //           label: '选项1',
        //           value: '1',
        //         },
        //         {
        //           label: '选项2',
        //           value: '2',
        //         },
        //       ],
        //     };
        //   }
        //   return {
        //     options: [
        //       {
        //         label: '选项1',
        //         value: '1',
        //       },
        //     ],
        //   };
        // },
        triggerFields: ['password'],
      },
      fieldName: 'options1',
      // layout: 'vertical',
      label: 'options1',
      // layout: 'horizontal',
      rules: z.string().min(1).default('1').optional(),
    },
  ],
});

function onSubmit(values: Record<string, any>) {
  // eslint-disable-next-line no-console
  console.log(111, values);
}
</script>

<template>
  <Page
    description="表单组件基础示例及基础表单校验，请注意，该页面用到的参数代码会添加一些简单注释，方便理解，请仔细查看。"
    title="表单组件"
  >
    <Card title="基础示例">
      <Form />
    </Card>
  </Page>
</template>
