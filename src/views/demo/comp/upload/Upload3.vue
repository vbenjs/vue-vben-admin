<template>
  <Alert message="嵌入表单,加入resultFiled自定义返回值" />
  <BasicForm @register="registerCustom" class="my-5" />
</template>

<script setup lang="ts">
  import { Alert } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();

  const schemasCustom: FormSchema[] = [
    {
      field: 'field3',
      component: 'Upload',
      label: '字段3',
      componentProps: {
        resultField: 'data3.url',
        api: (file, progress) => {
          return new Promise((resolve) => {
            uploadApi(file, progress).then((uploadApiResponse) => {
              resolve({
                code: 200,
                data3: {
                  url: uploadApiResponse.data.url,
                },
              });
            });
          });
        },
      },
    },
    {
      field: 'field4',
      component: 'ImageUpload',
      label: '字段4(ImageUpload)',
      colProps: {
        span: 8,
      },
      componentProps: {
        resultField: 'data4.url',
        api: (file, progress) => {
          return new Promise((resolve) => {
            uploadApi(file, progress).then((uploadApiResponse) => {
              resolve({
                code: 200,
                data4: {
                  url: uploadApiResponse.data.url,
                },
              });
            });
          });
        },
      },
    },
  ];
  const [registerCustom, { getFieldsValue: getFieldsValueCustom }] = useForm({
    labelWidth: 160,
    schemas: schemasCustom,
    actionColOptions: {
      span: 18,
    },
    submitFunc: () => {
      return new Promise((resolve) => {
        console.log(getFieldsValueCustom());
        resolve();
        createMessage.success(`请到控制台查看结果`);
      });
    },
  });
</script>
