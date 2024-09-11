<template>
  <PageWrapper title="富文本嵌入表单示例">
    <CollapseContainer title="富文本表单">
      <BasicForm
        :labelWidth="100"
        :schemas="schemas"
        :actionColOptions="{ span: 24 }"
        :baseColProps="{ span: 24 }"
        @submit="handleSubmit"
      />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { h } from 'vue';
  import { BasicForm, FormSchema } from '@/components/Form';
  import { CollapseContainer } from '@/components/Container';
  import { useMessage } from '@/hooks/web/useMessage';
  import { Tinymce } from '@/components/Tinymce';
  import { PageWrapper } from '@/components/Page';

  const schemas: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: 'title',
      defaultValue: 'defaultValue',
      rules: [{ required: true }],
    },
    {
      field: 'tinymce',
      component: 'Input',
      label: 'tinymce',
      defaultValue: 'defaultValue',
      rules: [{ required: true }],
      render: ({ model, field }) => {
        return h(Tinymce, {
          value: model[field],
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];
  const { createMessage } = useMessage();

  function handleSubmit(values: any) {
    createMessage.success('click search,values:' + JSON.stringify(values));
  }
</script>
