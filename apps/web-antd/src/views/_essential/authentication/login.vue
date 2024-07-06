<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/universal-ui';

import { AuthenticationLogin } from '@vben/universal-ui';

import { App } from 'ant-design-vue';

import { $t } from '#/locales';
import { useAccessStore } from '#/store';

defineOptions({ name: 'Login' });

const accessStore = useAccessStore();
const { notification } = App.useApp();

/**
 * @param params 登录表单数据
 */
async function handleLogin(params: LoginAndRegisterParams) {
  const { userInfo } = await accessStore.authLogin(params);
  if (userInfo?.realName) {
    notification.success({
      description: `${$t('authentication.login-success-desc')}:${userInfo?.realName}`,
      duration: 3,
      message: $t('authentication.login-success'),
    });
  }
}
</script>

<template>
  <AuthenticationLogin
    :loading="accessStore.loading"
    password-placeholder="123456"
    username-placeholder="vben"
    @submit="handleLogin"
  />
</template>
