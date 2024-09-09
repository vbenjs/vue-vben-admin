<script setup lang="ts">
import type { VbenFormSchema } from '@vben-core/form-ui';

import type { AuthenticationProps, LoginEmits } from './types';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';
import ThirdPartyLogin from './third-party-login.vue';

interface Props extends AuthenticationProps {
  formSchema: VbenFormSchema[];
}

defineOptions({
  name: 'AuthenticationLogin',
});

const props = withDefaults(defineProps<Props>(), {
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  formSchema: () => [],
  loading: false,
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showRememberMe: true,
  showThirdPartyLogin: true,
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  submit: LoginEmits['submit'];
}>();

const [Form, { setFieldValue, validate }] = useVbenForm(
  reactive({
    commonConfig: {
      hideLabel: true,
      hideRequiredMark: true,
    },
    schema: computed(() => props.formSchema),
    showDefaultActions: false,
  }),
);
const router = useRouter();

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);

async function handleSubmit() {
  const { valid, values } = await validate();
  if (valid) {
    localStorage.setItem(
      REMEMBER_ME_KEY,
      rememberMe.value ? values?.username : '',
    );
    emit('submit', values as { password: string; username: string });
  }
}

function handleGo(path: string) {
  router.push(path);
}

onMounted(() => {
  if (localUsername) {
    setFieldValue('username', localUsername);
  }
});
</script>

<template>
  <div @keydown.enter.prevent="handleSubmit">
    <slot name="title">
      <Title>
        {{ title || `${$t('authentication.welcomeBack')} 👋🏻` }}
        <template #desc>
          <span class="text-muted-foreground">
            {{ subTitle || $t('authentication.loginSubtitle') }}
          </span>
        </template>
      </Title>
    </slot>

    <Form />

    <div
      v-if="showRememberMe || showForgetPassword"
      class="mb-6 flex justify-between"
    >
      <div v-if="showRememberMe" class="flex-center">
        <VbenCheckbox v-model:checked="rememberMe" name="rememberMe">
          {{ $t('authentication.rememberMe') }}
        </VbenCheckbox>
      </div>

      <span
        v-if="showForgetPassword"
        class="text-primary hover:text-primary-hover active:text-primary-active cursor-pointer text-sm font-normal"
        @click="handleGo(forgetPasswordPath)"
      >
        {{ $t('authentication.forgetPassword') }}
      </span>
    </div>
    <VbenButton :loading="loading" class="w-full" @click="handleSubmit">
      {{ $t('common.login') }}
    </VbenButton>

    <div
      v-if="showCodeLogin || showQrcodeLogin"
      class="mb-2 mt-4 flex items-center justify-between"
    >
      <VbenButton
        v-if="showCodeLogin"
        class="w-1/2"
        variant="outline"
        @click="handleGo(codeLoginPath)"
      >
        {{ $t('authentication.mobileLogin') }}
      </VbenButton>
      <VbenButton
        v-if="showQrcodeLogin"
        class="ml-4 w-1/2"
        variant="outline"
        @click="handleGo(qrCodeLoginPath)"
      >
        {{ $t('authentication.qrcodeLogin') }}
      </VbenButton>
    </div>

    <!-- 第三方登录 -->
    <slot name="third-party-login">
      <ThirdPartyLogin v-if="showThirdPartyLogin" />
    </slot>

    <slot name="to-register">
      <div v-if="showRegister" class="mt-3 text-center text-sm">
        {{ $t('authentication.accountTip') }}
        <span
          class="text-primary hover:text-primary-hover active:text-primary-active cursor-pointer text-sm font-normal"
          @click="handleGo(registerPath)"
        >
          {{ $t('authentication.createAccount') }}
        </span>
      </div>
    </slot>
  </div>
</template>
