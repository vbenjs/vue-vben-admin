<template>
  <div>
    <BasicForm @register="register" @submit="handleSubmit" />
  </div>
</template>
<script lang="ts" setup>
  import { onMounted, ref } from 'vue';
  import { BasicForm, useForm } from '/@/components/Form';
  import { baseSetschemas } from './data';
  import { getEmailConfig, saveEmailConfig } from '/@/api/tools/email';
  const loading = ref(false);
  const [register, { setFieldsValue,validate }] = useForm({
    labelWidth: 120,
    schemas: baseSetschemas,
    showResetButton: false,
    submitButtonOptions: {
      text: '保存配置',
    },
    actionColOptions: {
      span: 18,
    },
  });

  onMounted(async () => {
    const data = await getEmailConfig();
    setFieldsValue(data);
  });

  async function handleSubmit() {
    try {
      loading.value = true;
      const values = await validate();

      await saveEmailConfig(values);
    } finally {
      loading.value = false;
    }
  }
</script>
