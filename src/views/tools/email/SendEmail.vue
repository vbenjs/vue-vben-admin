<template>
  <div v-loading="loading" loading-tip="发送中...">
    <BasicForm @register="register" @submit="handleSubmit" />
    <Loading :loading="loading" :absolute="true" tip="发送中..." />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { sendSchemas } from './data';
  import { sendEmail } from '/@/api/tools/email';
  import { Loading } from '/@/components/Loading';

  const loading = ref(false);
  const [register, { validate }] = useForm({
    labelWidth: 120,
    schemas: sendSchemas,
    submitButtonOptions: {
      text: '发送邮箱',
    },
    actionColOptions: {
      span: 18,
    },
  });

  async function handleSubmit() {
    try {
      loading.value = true;
      const values = await validate();

      await sendEmail(values);
    } finally {
      loading.value = false;
    }
  }
</script>
