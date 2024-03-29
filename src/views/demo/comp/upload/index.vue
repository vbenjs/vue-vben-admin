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

    
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { BasicUpload } from '@/components/Upload';
  import { useMessage } from '@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '@/components/Form';
  import { PageWrapper } from '@/components/Page';
  import { Alert } from 'ant-design-vue';
  import { uploadApi } from '@/api/sys/upload';

  const schemasValiate: FormSchema[] = [
    {
      field: 'field1',
      component: 'Upload',
      label: '字段1',
      rules: [{ required: true, message: '请选择上传文件' }],
      componentProps: {
        api: uploadApi,
      },
    },{
      field: 'field2',
      component: "ImageUpload",
      label: '字段2(ImageUpload)',
      colProps: {
        span: 8,
      },
      componentProps: {
        api: uploadApi,
      }
    },
  ];
  const schemasCustom: FormSchema[] = [
    {
      field: 'field3',
      component: 'Upload',
      label: '字段3',
      rules: [{ required: true, message: '请选择上传文件' }],
      componentProps: {
        resultField:"data3.url",
        api: (file,progress)=>{
          return new Promise((resolve)=>{
            uploadApi(file,progress).then((uploadApiResponse)=>{
              resolve({
                code:200,
                data3:{
                  url:uploadApiResponse.data.url
                }
              })
            })
          })
        },
      },
    },
    {
      field: 'field4',
      component: "ImageUpload",
      label: '字段4(ImageUpload)',
      colProps: {
        span: 8,
      },
      componentProps: {
        resultField:"data4.url",
        api: (file,progress)=>{
          return new Promise((resolve)=>{
            uploadApi(file,progress).then((uploadApiResponse)=>{
              resolve({
                code:200,
                data4:{
                  url:uploadApiResponse.data.url
                }
              })
            })
          })
        },
      },
    },
  ];
  const { createMessage } = useMessage();

  function handleChange(list: string[]) {
    createMessage.success(`已上传文件${JSON.stringify(list)}`);
  }
  const [registerValiate,{getFieldsValue:getFieldsValueValiate}] = useForm({
    labelWidth: 160,
    schemas:schemasValiate,
    actionColOptions: {
      span: 18,
    },
    submitFunc:()=>{
      return new Promise((resolve)=>{
        console.log(getFieldsValueValiate())
        resolve()
        createMessage.success(`请到控制台查看结果`);
      })
    }
  });

  const [registerCustom,{getFieldsValue:getFieldsValueCustom}] = useForm({
    labelWidth: 160,
    schemas:schemasCustom,
    actionColOptions: {
      span: 18,
    },
    submitFunc:()=>{
      return new Promise((resolve)=>{
        console.log(getFieldsValueCustom())
        resolve()
        createMessage.success(`请到控制台查看结果`);
      })
    }
  });
</script>
