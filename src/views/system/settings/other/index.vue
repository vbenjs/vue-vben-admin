<template>
  <div class="p-4">
    <ScrollContainer>
      <BasicForm @register="registerForm" />
    </ScrollContainer>
  </div>
</template>
<script lang="ts" setup>
  import { getFormSchema, keys } from './data';
  import { onMounted } from 'vue';
  import { getSystemConfig } from '@/api/system/systemConfig';
  import { useForm, BasicForm } from '@/components/Form';
  import { ScrollContainer } from '@/components/Container';

  const [registerForm, { setFieldsValue }] = useForm({
    labelWidth: 200,
    schemas: getFormSchema(),
    showActionButtonGroup: false,
    actionColOptions: {
      span: 23,
    },
  });

  onMounted(async () => {
    const data = await getSystemConfig(keys);
    const form: any = data;

    setFieldsValue(form);
  });
</script>
