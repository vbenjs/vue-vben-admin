<template>
   <PageWrapper title="对话填写表单" contentFullHeight>
      <CollapseContainer title="新增聊天内容">
        <BasicForm    
         autoFocusFirstItem
        :labelWidth="200"
        :schemas="schemas"
        :actionColOptions="{ span: 24 }"
        @submit="handleSubmit"
        @reset="handleReset"
        >

        
        </BasicForm>

      </CollapseContainer>
   </PageWrapper>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import { 
  // ApiSelect, 
  BasicForm, FormSchema } from '/@/components/Form';
import { PageWrapper } from '/@/components/Page';
// import { Select } from 'vxe-table';
import { CollapseContainer } from '/@/components/Container';



const schemas: FormSchema[] = [
    {
      field: 'divider-basic',
      component: 'Divider',
      label: '基础字段',
      colProps: {
        span: 24,
      },
    }]

export default defineComponent({
  components: { BasicForm, CollapseContainer, PageWrapper, 
    // ApiSelect, ASelect: Select 
  },
  setup() {


    return {
      schemas,
      handleReset: () => {
         
      },
      handleSubmit: () => {

      }
    }
  },
});


</script>