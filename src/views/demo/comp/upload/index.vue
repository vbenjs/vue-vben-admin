<template>
  <PageWrapper title="上传组件示例">
    <Alert message="基础示例" />
    <BasicUpload
      :maxSize="20"
      :maxNumber="10"
      @change="handleChange"
      :api="uploadApi"
      class="my-5"
      :accept="['image/*']"
    />

    <Alert message="嵌入表单,加入表单校验" />

    <BasicForm @register="registerValiate" class="my-5" />

    <Alert message="嵌入表单,加入resultFiled自定义返回值" />
    <BasicForm @register="registerCustom" class="my-5" />

    <Alert message="嵌入表单,自定义预览内容" />
    <BasicForm @register="registerPreview" class="my-5" />
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicUpload } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { PageWrapper } from '@/components/Page';
  import { Alert, Button } from 'ant-design-vue';
  import { uploadApi } from '@/api/sys/upload';
  import { createVNode } from 'vue';

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
  const schemasPreview: FormSchema[] = [
    {
      field: 'field5',
      component: 'Upload',
      label: '字段5',
      componentProps: {
        previewColumns: [
          {
            title: 'url5',
            dataIndex: 'url5',
          },
          {
            title: 'type5',
            dataIndex: 'type5',
          },
          {
            title: 'name5',
            dataIndex: 'name5',
          },
          {
            title: 'operation',
            dataIndex: '',
            customRender: ({ record }) => {
              return createVNode(
                Button,
                {
                  onclick: () => {
                    console.log(record);
                    createMessage.success(`请到控制台查看该行输出结果`);
                  },
                },
                '点我',
              );
            },
          },
        ],
        beforePreviewData: (arg) => {
          let data = arg
            .filter((item) => !!item)
            .map((item) => {
              if (typeof item !== 'string') {
                console.error('return value should be string');
                return;
              }
              return {
                url5: item,
                type5: item.split('.').pop() || '',
                name5: item.split('/').pop() || '',
              };
            });
          return data;
        },
        resultField: 'data5.url',
        api: (file, progress) => {
          return new Promise((resolve) => {
            uploadApi(file, progress).then((uploadApiResponse) => {
              resolve({
                code: 200,
                data5: {
                  url: uploadApiResponse.data.url,
                },
              });
            });
          });
        },
      },
    },
  ];

  const { createMessage } = useMessage();

  function handleChange(list: string[]) {
    createMessage.success(`已上传文件${JSON.stringify(list)}`);
  }
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

  // resultFields 字段示例
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

  // registerPreview
  const [registerPreview, { getFieldsValue: getFieldsValuePreview }] = useForm({
    labelWidth: 160,
    schemas: schemasPreview,
    actionColOptions: {
      span: 18,
    },
    submitFunc: () => {
      return new Promise((resolve) => {
        console.log(getFieldsValuePreview());
        resolve();
        createMessage.success(`请到控制台查看结果`);
      });
    },
  });
</script>
