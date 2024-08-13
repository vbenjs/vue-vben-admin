<script lang="ts" setup>
import { AuthenticationLogin } from '@vben/common-ui';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
</script>

<template>
  <AuthenticationLogin
    :loading="authStore.loginLoading"
    password-placeholder="123456"
    username-placeholder="vben"
    @submit="authStore.authLogin"
  />
</template>
