<template>
  <Alert message="嵌入表单,加入表单校验" />
  <BasicForm @register="registerValiate" class="my-5" />
</template>

<script setup lang="ts">
  import { Alert } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();

  const schemasValiate: FormSchema[] = [
    {
      field: 'field1',
      component: 'Upload',
      label: '字段1',
      rules: [{ required: true, message: '请选择上传文件' }],
      componentProps: {
        api: uploadApi,
      },
    },
    {
      field: 'field2',
      component: 'ImageUpload',
      label: '字段2(ImageUpload)',
      colProps: {
        span: 8,
      },
      componentProps: {
        api: uploadApi,
      },
    },
  ];
  const [registerValiate, { getFieldsValue: getFieldsValueValiate, validate }] = useForm({
    labelWidth: 160,
    schemas: schemasValiate,
    actionColOptions: {
      span: 18,
    },
    submitFunc: () => {
      return new Promise((resolve) => {
        validate()
          .then(() => {
            resolve();
            console.log(getFieldsValueValiate());
            createMessage.success(`请到控制台查看结果`);
          })
          .catch(() => {
            createMessage.error(`请输入必填项`);
          });
      });
    },
  });
</script>
