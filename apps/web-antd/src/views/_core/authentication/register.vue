<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/universal-ui';

import { ref } from 'vue';

import { AuthenticationRegister } from '@vben/universal-ui';

defineOptions({ name: 'Register' });

const loading = ref(false);

function handleSubmit(value: LoginAndRegisterParams) {
  // eslint-disable-next-line no-console
  console.log('register submit:', value);
}
</script>

<template>
  <AuthenticationRegister :loading="loading" @submit="handleSubmit" />
</template>
