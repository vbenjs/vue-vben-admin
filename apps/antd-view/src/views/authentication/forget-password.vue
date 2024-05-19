<script lang="ts" setup>
import { AuthenticationForgetPassword } from '@vben/common-ui';
import { ref } from 'vue';

defineOptions({ name: 'ForgetPassword' });

const loading = ref(false);

function handleSubmit(value: string) {
  // eslint-disable-next-line no-console
  console.log('reset email:', value);
}
</script>

<template>
  <AuthenticationForgetPassword :loading="loading" @submit="handleSubmit" />
</template>
