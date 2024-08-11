<script lang="ts" setup>
import type { LoginCodeParams } from '@vben/common-ui';

import { ref } from 'vue';

import { AuthenticationCodeLogin } from '@vben/common-ui';
import { LOGIN_PATH } from '@vben/constants';

defineOptions({ name: 'CodeLogin' });

const loading = ref(false);

/**
 * 异步处理登录操作
 * Asynchronously handle the login process
 * @param values 登录表单数据
 */
async function handleLogin(values: LoginCodeParams) {
  // eslint-disable-next-line no-console
  console.log(values);
}
</script>

<template>
  <AuthenticationCodeLogin
    :loading="loading"
    :login-path="LOGIN_PATH"
    @submit="handleLogin"
  />
</template>
