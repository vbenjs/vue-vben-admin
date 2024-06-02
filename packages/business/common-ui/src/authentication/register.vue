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

import type { RegisterEmits } from './typings';

interface Props {
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
  /**
   * @zh_CN 登陆路径
   */
  loginPath?: string;
}

defineOptions({
  name: 'RegisterForm',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
});

const emit = defineEmits<{
  submit: RegisterEmits['submit'];
}>();

const router = useRouter();

const formState = reactive({
  agreePolicy: false,
  comfirmPassword: '',
  password: '',
  submitted: false,
  username: '',
});

const usernameStatus = computed(() => {
  return formState.submitted && !formState.username ? 'error' : 'default';
});

const passwordStatus = computed(() => {
  return formState.submitted && !formState.password ? 'error' : 'default';
});

const comfirmPasswordStatus = computed(() => {
  return formState.submitted && formState.password !== formState.comfirmPassword
    ? 'error'
    : 'default';
});

function handleSubmit() {
  formState.submitted = true;
  if (
    usernameStatus.value !== 'default' ||
    passwordStatus.value !== 'default'
  ) {
    return;
  }

  emit('submit', {
    password: formState.password,
    username: formState.username,
  });
}

function goLogin() {
  router.push(props.loginPath);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.create-an-account') }} 🚀
      <template #desc> {{ $t('authentication.sign-up-subtitle') }} </template>
    </Title>
    <VbenInput
      v-model="formState.username"
      :status="usernameStatus"
      :error-tip="$t('authentication.username-tip')"
      :label="$t('authentication.username')"
      name="username"
      :placeholder="$t('authentication.username')"
      type="text"
    />
    <!-- Use 8 or more characters with a mix of letters, numbers & symbols. -->
    <VbenInputPassword
      v-model="formState.password"
      :status="passwordStatus"
      :error-tip="$t('authentication.password-tip')"
      :label="$t('authentication.password')"
      name="password"
      :placeholder="$t('authentication.password')"
      required
      type="password"
      :password-strength="true"
    >
      <template #strengthText>
        {{ $t('authentication.password-strength') }}
      </template>
    </VbenInputPassword>

    <VbenInputPassword
      v-model="formState.comfirmPassword"
      :status="comfirmPasswordStatus"
      :error-tip="$t('authentication.comfirm-password-tip')"
      :label="$t('authentication.comfirm-password')"
      name="comfirmPassword"
      :placeholder="$t('authentication.comfirm-password')"
      required
      type="password"
    />

    <div class="relative mt-4 flex pb-6">
      <div class="flex-center">
        <VbenCheckbox
          v-model:checked="formState.agreePolicy"
          name="agreePolicy"
        >
          {{ $t('authentication.sign-up-agree') }}
          <span class="text-primary hover:text-primary/80">{{
            $t('authentication.sign-up-privacy-policy')
          }}</span>
          &
          <span class="text-primary hover:text-primary/80">
            {{ $t('authentication.sign-up-terms') }}
          </span>
        </VbenCheckbox>
      </div>
      <Transition name="slide-up">
        <p
          v-show="formState.submitted && !formState.agreePolicy"
          class="text-destructive absolute bottom-1 left-0 text-xs"
        >
          {{ $t('authentication.sign-up-agree-tip') }}
        </p>
      </Transition>
    </div>
    <div>
      <VbenButton :loading="loading" class="w-full" @click="handleSubmit">
        {{ $t('authentication.sign-up') }}
      </VbenButton>
    </div>
    <div class="mt-4 text-center text-sm">
      {{ $t('authentication.already-account') }}
      <span
        class="text-primary hover:text-primary/80 cursor-pointer text-sm font-normal"
        @click="goLogin()"
      >
        {{ $t('authentication.go-login') }}
      </span>
    </div>
  </div>
</template>
