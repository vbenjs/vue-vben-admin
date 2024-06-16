<script setup lang="ts">
import type { LoginEmits } from './typings';

import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import {
  VbenButton,
  VbenCheckbox,
  VbenInput,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';
import ThirdPartyLogin from './third-party-login.vue';

interface Props {
  /**
   * @zh_CN 验证码登录路径
   */
  codeLoginPath?: string;

  /**
   * @zh_CN 忘记密码路径
   */
  forgetPasswordPath?: string;

  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;

  /**
   * @zh_CN 密码占位符
   */
  passwordPlaceholder?: string;

  /**
   * @zh_CN 二维码登录路径
   */
  qrCodeLoginPath?: string;

  /**
   * @zh_CN 注册路径
   */
  registerPath?: string;

  /**
   * @zh_CN 是否显示验证码登录
   */
  showCodeLogin?: boolean;

  /**
   * @zh_CN 是否显示忘记密码
   */
  showForgetPassword?: boolean;

  /**
   * @zh_CN 是否显示二维码登录
   */
  showQrcodeLogin?: boolean;

  /**
   * @zh_CN 是否显示注册按钮
   */
  showRegister?: boolean;

  /**
   * @zh_CN 是否显示第三方登录
   */
  showThirdPartyLogin?: boolean;

  /**
   * @zh_CN 用户名占位符
   */
  usernamePlaceholder?: string;
}

defineOptions({
  name: 'AuthenticationLogin',
});

withDefaults(defineProps<Props>(), {
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  loading: false,
  passwordPlaceholder: '',
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showThirdPartyLogin: true,
  usernamePlaceholder: '',
});

const emit = defineEmits<{
  submit: LoginEmits['submit'];
}>();

const router = useRouter();

const REMEMBER_ME_KEY = 'REMEMBER_ME_USERNAME';

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const formState = reactive({
  password: '',
  rememberMe: !!localUsername,
  submitted: false,
  username: localUsername,
});

const usernameStatus = computed(() => {
  return formState.submitted && !formState.username ? 'error' : 'default';
});

const passwordStatus = computed(() => {
  return formState.submitted && !formState.password ? 'error' : 'default';
});

function handleSubmit() {
  formState.submitted = true;

  if (
    usernameStatus.value !== 'default' ||
    passwordStatus.value !== 'default'
  ) {
    return;
  }

  localStorage.setItem(
    REMEMBER_ME_KEY,
    formState.rememberMe ? formState.username : '',
  );

  emit('submit', {
    password: formState.password,
    username: formState.username,
  });
}

function handleGo(path: string) {
  router.push(path);
}
</script>

<template>
  <div @keypress.enter.prevent="handleSubmit">
    <Title>
      {{ $t('authentication.welcome-back') }} 👋🏻
      <template #desc>
        <span class="text-muted-foreground">
          {{ $t('authentication.login-subtitle') }}
        </span>
      </template>
    </Title>

    <VbenInput
      v-model="formState.username"
      :autofocus="false"
      :error-tip="$t('authentication.username-tip')"
      :label="$t('authentication.username')"
      :placeholder="usernamePlaceholder || $t('authentication.username')"
      :status="usernameStatus"
      name="username"
      required
      type="text"
    />
    <VbenInputPassword
      v-model="formState.password"
      :error-tip="$t('authentication.password-tip')"
      :label="$t('authentication.password')"
      :placeholder="passwordPlaceholder || $t('authentication.password')"
      :status="passwordStatus"
      name="password"
      required
      type="password"
    />

    <div class="mb-6 mt-4 flex justify-between">
      <div class="flex-center flex">
        <VbenCheckbox v-model:checked="formState.rememberMe" name="rememberMe">
          {{ $t('authentication.remember-me') }}
        </VbenCheckbox>
      </div>

      <span
        v-if="showForgetPassword"
        class="text-primary hover:text-primary/80 cursor-pointer text-sm font-normal"
        @click="handleGo(forgetPasswordPath)"
      >
        {{ $t('authentication.forget-password') }}
      </span>
      <!-- <VbenButton variant="ghost" @click="handleGo('/auth/forget-password')">
        忘记密码?
      </VbenButton> -->
    </div>
    <VbenButton :loading="loading" class="w-full" @click="handleSubmit">
      {{ $t('common.login') }}
    </VbenButton>

    <div class="mb-2 mt-4 flex items-center justify-between">
      <VbenButton
        v-if="showCodeLogin"
        class="w-1/2"
        variant="outline"
        @click="handleGo(codeLoginPath)"
      >
        {{ $t('authentication.mobile-login') }}
      </VbenButton>
      <VbenButton
        v-if="showQrcodeLogin"
        class="ml-4 w-1/2"
        variant="outline"
        @click="handleGo(qrCodeLoginPath)"
      >
        {{ $t('authentication.qrcode-login') }}
      </VbenButton>
      <!-- <VbenButton
        :loading="loading"
        variant="outline"
        class="w-1/3"
        @click="handleGo('/auth/register')"
      >
        创建账号
      </VbenButton> -->
    </div>

    <!-- 第三方登录 -->
    <ThirdPartyLogin v-if="showThirdPartyLogin" />

    <div v-if="showRegister" class="text-center text-sm">
      {{ $t('authentication.account-tip') }}
      <span
        class="text-primary hover:text-primary/80 cursor-pointer text-sm font-normal"
        @click="handleGo(registerPath)"
      >
        {{ $t('authentication.create-account') }}
      </span>
    </div>
  </div>
</template>
