<template>
  <PageWrapper title="代码编辑器组件嵌入Form示例">
    <CollapseContainer title="代码编辑器组件">
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
  import { PageWrapper } from '@/components/Page';
  import { CodeEditor, MODE } from '@/components/CodeEditor';

  const schemas: FormSchema[] = [
    {
      field: 'title',
      component: 'Input',
      label: 'title',
      defaultValue: '标题',
      rules: [{ required: true }],
    },
    {
      field: 'JSON',
      component: 'Input',
      label: 'JSON',
      defaultValue: `{
        "name":"BeJson",
        "url":"http://www.xxx.com",
        "page":88,
        "isNonProfit":true,"
        address:{ 
            "street":"科技园路.",
            "city":"江苏苏州",
            "country":"中国"
        },
}`,
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(CodeEditor, {
          value: model[field],
          mode: MODE.JSON,
          onChange: (value: string) => {
            model[field] = value;
          },
          config: {
            tabSize: 10,
          },
        });
      },
    },
    {
      field: 'PYTHON',
      component: 'Input',
      label: 'PYTHON',
      defaultValue: `def functionname( parameters ):
   "函数_文档字符串"
   function_suite
   return [expression]`,
      rules: [{ required: true, trigger: 'blur' }],
      render: ({ model, field }) => {
        return h(CodeEditor, {
          value: model[field],
          mode: MODE.PYTHON,
          onChange: (value: string) => {
            model[field] = value;
          },
        });
      },
    },
  ];
  const { createMessage } = useMessage();

  function handleSubmit(values: any) {
    console.log('click search,values:', values);
    createMessage.success('click search,values:' + JSON.stringify(values));
  }
</script>
