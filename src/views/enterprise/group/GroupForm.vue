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
  import { useRoute } from 'vue-router';
  import { getCompanyById } from '@/api/company/company';

  defineOptions({ name: 'GroupForm' });

  const route = useRoute();
  const { createMessage: message } = useMessage();
  const [registerForm, { validate, resetSchema, setFieldsValue }] = useForm({
    // layout: 'vertical',
    rowProps: { gutter: 24 },
    // labelWidth: 100,
    showActionButtonGroup: false,
    submitOnChange: false,
  });

  onMounted(() => {
    init(Number(route.params.id));
  });

  const init = async (id: number) => {
    if (!id) {
      resetSchema(getFormSchema('create'));
    } else {
      await resetSchema(getFormSchema('edit'));
      const data = await getCompanyById(id);
      setFieldsValue(data);
    }
  };

  async function handleSubmit() {
    try {
      const values = await validate();
      console.log('values', values);
      message.success(`新建${'集团'}成功！`);
      // closeCurrent();
    } finally {
      //
    }
  }
</script>
