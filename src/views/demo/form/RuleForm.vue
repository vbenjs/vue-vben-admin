<template>
  <PageWrapper title="表单校验示例">
    <div class="mb-4">
      <a-button @click="validateForm" class="mr-2"> 手动校验表单 </a-button>
      <a-button @click="resetValidate" class="mr-2"> 清空校验信息 </a-button>
      <a-button @click="getFormValues" class="mr-2"> 获取表单值 </a-button>
      <a-button @click="setFormValues" class="mr-2"> 设置表单值 </a-button>
    </div>
    <CollapseContainer title="表单校验">
      <BasicForm @register="register" @submit="handleSubmit" />
    </CollapseContainer>
  </PageWrapper>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { BasicForm, FormSchema, useForm } from '/@/components/Form/index';
  import { CollapseContainer } from '/@/components/Container/index';
  import { useMessage } from '/@/hooks/web/useMessage';
  import { PageWrapper } from '/@/components/Page';

  const schemas: FormSchema[] = [
    {
      field: 'field1',
      component: 'Input',
      label: '字段1',
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field2',
      component: 'Input',
      label: '字段2',
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field3',
      component: 'DatePicker',
      label: '字段3',
      colProps: {
        span: 8,
      },
      required: true,
    },
    {
      field: 'field4',
      component: 'Select',
      label: '字段4',
      colProps: {
        span: 8,
      },
      componentProps: {
        options: [
          {
            label: '选项1',
            value: '1',
            key: '1',
          },
          {
            label: '选项2',
            value: '2',
            key: '2',
          },
        ],
      },
      rules: [
        {
          required: true,
          message: '请输入aa',
        },
      ],
    },
    {
      field: 'field44',
      component: 'Input',
      label: '自定义校验',
      colProps: {
        span: 8,
      },
      rules: [
        {
          required: true,
          // @ts-ignore
          validator: async (rule, value) => {
            if (!value) {
              /* eslint-disable-next-line */
              return Promise.reject('值不能为空');
            }
            if (value === '1') {
              /* eslint-disable-next-line */
              return Promise.reject('值不能为1');
            }
            return Promise.resolve();
          },
          trigger: 'change',
        },
      ],
    },
    {
      field: 'field5',
      component: 'CheckboxGroup',
      label: '字段5',
      colProps: {
        span: 8,
      },
      componentProps: {
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
      },
      rules: [{ required: true }],
    },
    {
      field: 'field7',
      component: 'RadioGroup',
      label: '字段7',
      colProps: {
        span: 8,
      },
      componentProps: {
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
      },
      rules: [{ required: true, message: '覆盖默认生成的校验信息' }],
    },
  ];

  export default defineComponent({
    components: { BasicForm, CollapseContainer, PageWrapper },
    setup() {
      const { createMessage } = useMessage();
      const [register, { validateFields, clearValidate, getFieldsValue, setFieldsValue }] = useForm(
        {
          labelWidth: 120,
          schemas,
          actionColOptions: {
            span: 24,
          },
        }
      );
      async function validateForm() {
        try {
          const res = await validateFields();
          console.log('passing', res);
        } catch (error) {
          console.log('not passing', error);
        }
      }
      async function resetValidate() {
        clearValidate();
      }
      function getFormValues() {
        const values = getFieldsValue();
        createMessage.success('values:' + JSON.stringify(values));
      }
      function setFormValues() {
        setFieldsValue({
          field1: 1111,
          field5: ['1'],
          field7: '1',
        });
      }
      return {
        register,
        schemas,
        handleSubmit: (values: any) => {
          createMessage.success('click search,values:' + JSON.stringify(values));
        },
        getFormValues,
        setFormValues,
        validateForm,
        resetValidate,
      };
    },
  });
</script>
