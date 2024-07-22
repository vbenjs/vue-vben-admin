<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/common-ui';

import { ref } from 'vue';

import { AuthenticationRegister } from '@vben/common-ui';
import { LOGIN_PATH } from '@vben/constants';

defineOptions({ name: 'Register' });

const loading = ref(false);

function handleSubmit(value: LoginAndRegisterParams) {
  // eslint-disable-next-line no-console
  console.log('register submit:', value);
}
</script>

<template>
  <AuthenticationRegister
    :loading="loading"
    :login-path="LOGIN_PATH"
    @submit="handleSubmit"
  />
</template>
