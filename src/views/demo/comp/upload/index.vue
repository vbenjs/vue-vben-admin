<template>
  <div class="p-4">
    <a-alert message="基础示例" class="my-5"></a-alert>
    <BasicUpload :maxSize="20" :maxNumber="10" @change="handleChange" :api="uploadApi" />

    <a-alert message="嵌入表单,加入表单校验" class="my-5"></a-alert>

    <BasicForm @register="register" />
  </div>
</template>
<script lang="ts">
  import { defineComponent, h } from 'vue';
  import { BasicUpload } from '/@/components/Upload';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';

  import { uploadApi } from '/@/api/sys/upload';
  //   import { Alert } from 'ant-design-vue';

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      rules: [{ required: true, type: 'array', message: '请选择上传文件' }],
      render: ({ model, field }) => {
        return h(BasicUpload, {
          value: model[field],
          api: uploadApi,
          onChange: (val: string[]) => {
            model[field] = val;
          },
        });
      },
    },
  ];
  export default defineComponent({
    components: { BasicUpload, BasicForm },
    setup() {
      const { createMessage } = useMessage();
      const [register] = useForm({
        labelWidth: 120,
        schemas,
        actionColOptions: {
          span: 16,
        },
      });
      return {
        handleChange: (list: string[]) => {
          createMessage.info(`已上传文件${JSON.stringify(list)}`);
        },
        uploadApi,
        register,
      };
    },
  });
</script>
