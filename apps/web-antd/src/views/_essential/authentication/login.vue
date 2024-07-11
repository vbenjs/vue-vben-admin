<script lang="ts" setup>
import { AuthenticationLogin } from '@vben/universal-ui';

import { useAccessStore } from '#/store';

defineOptions({ name: 'Login' });

const accessStore = useAccessStore();
</script>

<template>
  <AuthenticationLogin
    :loading="accessStore.loading"
    password-placeholder="123456"
    username-placeholder="vben"
    @submit="accessStore.authLogin"
  />
</template>
