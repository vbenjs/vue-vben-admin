<template>
   <PageWrapper title="对话填写表单" contentFullHeight>
      <CollapseContainer title="新增聊天内容">
        <BasicForm @register="register"></BasicForm>
      </CollapseContainer>
   </PageWrapper>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import {  ApiSelect, BasicForm, FormSchema, useForm } from '/@/components/Form';
import { PageWrapper } from '/@/components/Page';
import { Select } from 'vxe-table';
import { CollapseContainer } from '/@/components/Container';
import { useMessage } from '/@/hooks/web/useMessage';
import { createChatApi } from '/@/api/demo/lovechat';

const chatOwnerOptions = [
    {
      id: '1',
      label: '赵艳超',
      value: '1',
      key: '1',
    },
    {
      id: '2',
      label: '赵甜',
      value: '2',
      key: '2',
    },
  ];

const messageTypeOptions = [
  {
      id: '1',
      label: '文字',
      value: '1',
      key: '1',
  },
  {
      id: '2',
      label: '图片',
      value: '2',
      key: '2',
  },
  {
      id: '3',
      label: '语音',
      value: '3',
      key: '3',
  },
  {
      id: '4',
      label: '语音通话',
      value: '4',
      key: '4',
  },
  {
      id: '5',
      label: '视频通话',
      value: '5',
      key: '5',
  }
];



const schemas: FormSchema[] = [
    {
      field: 'divider-basic',
      component: 'Divider',
      label: '基础字段',
      colProps: {
        span: 24,
      },
    },

    {
      field: 'owner_id',
      component: 'Select',
      label: '说话人',
      colProps: {
        span: 8,
      },
      componentProps: ({ formModel, formActionType }) => {
        return {
          options: chatOwnerOptions,
          placeholder: '赵艳超',
          onChange: (e: any) => {
          },
        };
      },
    },

    {
      field: 'content_type',
      component: 'Select',
      label: '消息类型',
      colProps: {
        span: 8,
      },
      componentProps: ({ formModel, formActionType }) => {
        return {
          options: messageTypeOptions,
          placeholder: '文字',
          onChange: (e: any) => {
          },
        };
      },
    },

    {
      field: 'send_time',
      component: 'Input',
      label: '发送时间',
      colProps : {
        span: 8,
      },
      componentProps: {
        placeholder: '2022-12-01 18:00:00',
      },
      required: true,
    },

    {
      field: 'content',
      component: 'InputTextArea',
      label: '目标描述',
      colProps: {
        span: 8,
      },
      componentProps: {
        placeholder: '聊天内容',
        rows: 4,
      },
    },

    ]


export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, ApiSelect, ASelect: Select },
  setup() {
    const { createMessage } = useMessage();
    const [register, { validate, setProps, getFieldsValue }] = useForm({
        labelCol: {
          span: 8,
        },
        wrapperCol: {
          span: 15,
        },
        schemas: schemas,
        actionColOptions: {
          offset: 8,
          span: 23,
        },
        submitButtonOptions: {
          text: '提交',
        },
        submitFunc: handleSubmit,
      });

    

      async function handleSubmit() {
        try {
          await validate();
          setProps({
            submitButtonOptions: {
              loading: true,
            },
          });

          let params = getFieldsValue()
          console.log("params", params)
          await createChatApi(params)
         
  
        } catch (error) {
     
        } finally {
          setProps({
            submitButtonOptions: {
              loading: false,
            },
          });
        }
      }
  

    return {
      register
    }
  },
});


</script>