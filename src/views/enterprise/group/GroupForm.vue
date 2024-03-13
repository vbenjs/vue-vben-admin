<template>
  <PageWrapper contentFullHeight>
    <Card>
      <BasicForm @register="registerForm" />
    </Card>
    <div class="h-10"></div>

    <template #rightFooter>
      <ApiButton type="primary" :api="handleSubmit"> 提交 </ApiButton>
    </template>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { getFormSchema } from './data';
  import { Card } from 'ant-design-vue';
  import { useForm, BasicForm } from '@/components/Form';
  import ApiButton from '@/components/Button/src/ApiButton.vue';
  import { useMessage } from '@/hooks/web/useMessage';
  import { PageWrapper } from '@/components/Page';
  import { onMounted } from 'vue';

  defineOptions({ name: 'GroupForm' });

  const { createMessage: message } = useMessage();
  const [registerForm, { validate, resetSchema }] = useForm({
    // layout: 'vertical',
    rowProps: { gutter: 24 },
    // labelWidth: 100,
    showActionButtonGroup: false,
    submitOnChange: false,
  });

  onMounted(() => {
    resetSchema(getFormSchema('create'));
  });

  async function handleSubmit() {
    let values: any = {};
    try {
      values = await validate();
    } catch (error) {
      message.warning('请先完成表单填写！');
      return;
    }
    try {
      console.log('values', values);
      message.success(`新建${'集团'}成功！`);
      // closeCurrent();
    } finally {
      //
    }
  }
</script>
