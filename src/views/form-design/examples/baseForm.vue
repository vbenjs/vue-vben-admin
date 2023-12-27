<template>
  <BasicForm @register="register" />
</template>
<script lang="ts" setup>
  import { BasicForm, FormSchema, useForm } from '@/components/Form';

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      span: 8,
      // colProps: {
      //   span: 8,
      // },
      componentProps: {
        placeholder: '自定义placeholder',
        onChange: (_e: any) => {
          //
        },
      },
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      span: 8,
      // colProps: {
      //   span: 8,
      // },
    },
  ];

  const [register] = useForm({
    schemas,
  });
</script>
