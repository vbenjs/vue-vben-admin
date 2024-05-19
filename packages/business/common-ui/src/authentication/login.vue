<script setup lang="ts">
import {
  VbenButton,
  VbenCheckbox,
  VbenInput,
  VbenInputPassword,
} from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import Title from './auth-title.vue';
import ThirdPartyLogin from './third-party-login.vue';

import type { LoginEmits } from './typings';

interface Props {
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
}

defineOptions({
  name: 'AuthenticationLogin',
});

withDefaults(defineProps<Props>(), {
  loading: false,
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
  <div>
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
      :status="usernameStatus"
      :error-tip="$t('authentication.username-tip')"
      :label="$t('authentication.username')"
      name="username"
      :placeholder="$t('authentication.username')"
      type="text"
      :autofocus="false"
      @keyup.enter="handleSubmit"
    />
    <VbenInputPassword
      v-model="formState.password"
      :status="passwordStatus"
      :error-tip="$t('authentication.password-tip')"
      :label="$t('authentication.password')"
      name="password"
      :placeholder="$t('authentication.password')"
      required
      type="password"
      @keyup.enter="handleSubmit"
    />

    <div class="mb-6 mt-4 flex justify-between">
      <div class="flex-center flex">
        <VbenCheckbox v-model:checked="formState.rememberMe" name="rememberMe">
          {{ $t('authentication.remember-me') }}
        </VbenCheckbox>
      </div>

      <span
        class="text-primary hover:text-primary/80 cursor-pointer text-sm font-normal"
        @click="handleGo('/auth/forget-password')"
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
        variant="outline"
        class="w-1/2"
        @click="handleGo('/auth/code-login')"
      >
        {{ $t('authentication.mobile-login') }}
      </VbenButton>
      <VbenButton
        variant="outline"
        class="ml-4 w-1/2"
        @click="handleGo('/auth/qrcode-login')"
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
    <ThirdPartyLogin />

    <div class="text-center text-sm">
      {{ $t('authentication.account-tip') }}
      <span
        class="text-primary hover:text-primary/80 cursor-pointer text-sm font-normal"
        @click="handleGo('/auth/register')"
      >
        {{ $t('authentication.create-account') }}
      </span>
    </div>
  </div>
</template>
