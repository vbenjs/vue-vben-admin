<script lang="ts" setup>
import type { LoginAndRegisterParams } from '@vben/common-ui';

import { getUserInfo, userLogin } from '@/services';
import { AuthenticationLogin } from '@vben/common-ui';
import { useRequest } from '@vben/hooks';
import { $t } from '@vben/locales';
import { useAccessStore } from '@vben/stores';
import { notification } from 'ant-design-vue';
import { computed } from 'vue';
import { useRouter } from 'vue-router';

defineOptions({ name: 'Login' });

const router = useRouter();
const accessStore = useAccessStore();

const { loading, runAsync: runUserLogin } = useRequest(userLogin, {
  manual: true,
});

const { loading: userInfoLoading, runAsync: runGetUserInfo } = useRequest(
  getUserInfo,
  {
    manual: true,
  },
);

/**
 * 异步处理登录操作
 * Asynchronously handle the login process
 * @param values 登录表单数据
 */
async function handleLogin(values: LoginAndRegisterParams) {
  // 异步处理用户登录操作并获取 accessToken
  // Asynchronously handle the user login operation and obtain the accessToken
  const { accessToken } = await runUserLogin(values);

  // 如果成功获取到 accessToken
  // If accessToken is successfully obtained
  if (accessToken) {
    // 将 accessToken 存储到 accessStore 中
    // Store the accessToken in accessStore
    accessStore.setAccessToken(accessToken);

    // 获取用户信息并存储到 accessStore 中
    // Get user information and store it in accessStore
    const userInfo = await runGetUserInfo();
    accessStore.setUserInfo(userInfo);

    // 跳转到用户信息中定义的 homePath 路径
    // Redirect to the homePath defined in the user information
    await router.push(userInfo.homePath);
    notification.success({
      description: `${$t('authentication.login-success-desc')}:${userInfo.realName}`,
      duration: 3,
      message: $t('authentication.login-success'),
    });
  }
}

const loginLoading = computed(() => {
  return loading.value || userInfoLoading.value;
});
</script>

<template>
  <AuthenticationLogin :loading="loginLoading" @submit="handleLogin" />
</template>
