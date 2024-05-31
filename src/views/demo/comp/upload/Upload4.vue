<template>
  <Alert message="嵌入表单,自定义预览内容" />
  <BasicForm @register="registerPreview" class="my-5" />
</template>

<script setup lang="ts">
  import { createVNode } from 'vue';
  import { Alert, Button } from 'ant-design-vue';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { useMessage } from '@/hooks/web/useMessage';
  import { uploadApi } from '@/api/sys/upload';

  const { createMessage } = useMessage();

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
                () => '点我输出该行信息',
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
    {
      field: 'field6',
      component: 'Upload',
      label: '字段6',
      componentProps: {
        maxNumber: 2,
        previewColumns: ({ handleRemove, handleAdd }) => {
          return [
            {
              title: 'url6',
              dataIndex: 'url6',
            },
            {
              title: 'type6',
              dataIndex: 'type6',
            },
            {
              title: '操作1',
              dataIndex: 'operation',
              customRender: ({ record }) => {
                return createVNode('div', {}, [
                  createVNode(
                    Button,
                    {
                      type: 'primary',
                      style: 'margin:4px',
                      onclick: () => {
                        handleAdd({
                          record: {
                            id6: new Date().getTime(),
                            url6: 'https://vebn.oss-cn-beijing.aliyuncs.com/vben/logo.png',
                          },
                          uidKey: 'id6',
                          valueKey: 'url6',
                        });
                      },
                    },
                    () => '点我新增',
                  ),
                  createVNode(
                    Button,
                    {
                      danger: true,
                      onclick: () => {
                        handleRemove({
                          record: { url6: record.url6 },
                          uidKey: 'url6',
                          valueKey: 'url6',
                        });
                      },
                    },
                    () => '点我删除',
                  ),
                ]);
              },
            },
          ];
        },
        beforePreviewData: (arg) => {
          let data = arg
            .filter((item) => !!item)
            .map((item) => {
              if (typeof item !== 'object') {
                console.error('return value should be object');
                return;
              }
              return {
                uid: item?.uid,
                url6: item?.url,
                type6: item?.url?.split('.').pop() || '',
                name6: item?.url?.split('/').pop() || '',
              };
            });
          return data;
        },
        resultField: 'data6.url',
        api: (file, progress) => {
          return new Promise((resolve) => {
            uploadApi(file, progress).then((uploadApiResponse) => {
              resolve({
                code: 200,
                data6: {
                  url: uploadApiResponse.data.url,
                },
              });
            });
          });
        },
      },
    },
  ];
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
