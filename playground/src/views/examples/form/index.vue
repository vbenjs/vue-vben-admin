<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { Page, useVbenForm, z } from '@vben/common-ui';

import { Card } from 'ant-design-vue';

// const schema = z.object({
//   username: z.string(),
// });

const schema: VbenFormSchema[] = [
  {
    component: 'VbenInput',
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
    component: 'VbenInputPassword',
    fieldName: 'password',
    help: '123',
    // layout: 'vertical',
    label: 'Password',
    // layout: 'horizontal',
    rules: z.string().min(1),
  },
  {
    component: 'VbenSelect',
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
];

// for (let index = 0; index < 5; index++) {
//   schema.push({
//     component: 'VbenInput',
//     componentProps: {
//       // placeholder: '请输入用户名',
//     },
//     fieldName: `username${index}`,
//     label: `Username${index}`,
//     // layout: 'horizontal',
//     rules: z.string().min(1).optional(),
//   });
// }

const [Form] = useVbenForm({
  gridClass: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
  handleSubmit: onSubmit,
  layout: 'horizontal',
  schema,
});

function onSubmit(values: Record<string, any>) {
  // eslint-disable-next-line no-console
  console.log(111, values);
}
</script>

<template>
  <Page description="表单组件" title="表单组件示例">
    <Card>
      <Form />
    </Card>
  </Page>
</template>
