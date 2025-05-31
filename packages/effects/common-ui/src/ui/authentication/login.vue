<script setup lang="ts">
import type { Recordable, TabOption } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';

import type { AuthenticationProps } from './types';

import { computed, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { AuthenticationCodeLogin, LoginTabs2 } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton, VbenCheckbox } from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';
import ThirdPartyLogin from './third-party-login.vue';

interface Props extends AuthenticationProps {
  formSchema?: VbenFormSchema[];
  smsFormSchema?: VbenFormSchema[];
}

defineOptions({
  name: 'AuthenticationLogin',
});

const props = withDefaults(defineProps<Props>(), {
  codeLoginPath: '/auth/code-login',
  forgetPasswordPath: '/auth/forget-password',
  formSchema: () => [],
  smsFormSchema: () => [],
  loading: false,
  qrCodeLoginPath: '/auth/qrcode-login',
  registerPath: '/auth/register',
  showCodeLogin: true,
  showForgetPassword: true,
  showQrcodeLogin: true,
  showRegister: true,
  showRememberMe: true,
  showThirdPartyLogin: true,
  submitButtonText: '',
  subTitle: '',
  title: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

const smscodeLoading = ref(false);

const [Form, formApi] = useVbenForm(
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

const loginTabs: TabOption[] = [
  {
    label: '账号密码登录',
    value: 'account',
  },
  {
    label: '验证码登录',
    value: 'smsCode',
  },
];
const activeTabKey = ref(loginTabs[0]?.value);

const REMEMBER_ME_KEY = `REMEMBER_ME_USERNAME_${location.hostname}`;

const localUsername = localStorage.getItem(REMEMBER_ME_KEY) || '';

const rememberMe = ref(!!localUsername);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    localStorage.setItem(
      REMEMBER_ME_KEY,
      rememberMe.value ? values?.username : '',
    );
    emit('submit', values);
  }
}

/**
 * 异步处理登录操作
 * Asynchronously handle the login process
 * @param values 登录表单数据
 */
async function handleSmsLogin(values: Recordable<any>) {
  // eslint-disable-next-line no-console
  console.log(values);
}

function handleGo(path: string) {
  router.push(path);
}

const resetFormValidate = (value: string) => {
  console.warn('resetFormValidate', value);
  if (value === 'account') {
    formApi.resetValidate();
  }
};

const updateActiveTabKey = (value: string) => {
  activeTabKey.value = value;
  resetFormValidate(value);
};

onMounted(() => {
  if (localUsername) {
    formApi.setFieldValue('username', localUsername);
  }
});

defineExpose({
  getFormApi: () => formApi,
});
</script>

<template>
  <div @keydown.enter.prevent="handleSubmit">
    <slot name="loginHeader">
      <div class="mb-6 flex items-center justify-between">
        <slot name="logo">
          <img
            class="h-10 w-10"
            src="/static/login_logo.png"
            alt="login_logo.png"
          />
        </slot>
      </div>
    </slot>
    <slot name="title">
      <Title>
        <slot name="title">
          {{ title || `${$t('authentication.welcomeBack')} ` }}
        </slot>
        <!-- <template #desc>
          <span class="text-muted-foreground">
            <slot name="subTitle">
              {{ subTitle || $t('authentication.loginSubtitle') }}
            </slot>
          </span>
        </template> -->
      </Title>
    </slot>
    <LoginTabs2 :tabs="loginTabs" @update-active-key="updateActiveTabKey">
      <template #account>
        <Form />
        <div
          v-if="showRememberMe || showForgetPassword"
          class="mb-6 flex justify-between"
        >
          <div class="flex-center">
            <VbenCheckbox
              v-if="showRememberMe"
              v-model:checked="rememberMe"
              name="rememberMe"
            >
              {{ $t('authentication.rememberMe') }}
            </VbenCheckbox>
          </div>

          <span
            v-if="showForgetPassword"
            class="vben-link text-sm font-normal"
            @click="handleGo(forgetPasswordPath)"
          >
            {{ $t('authentication.forgetPassword') }}
          </span>
        </div>
        <VbenButton
          :class="{
            'cursor-wait': loading,
          }"
          :loading="loading"
          aria-label="login"
          class="h-10 w-full"
          @click="handleSubmit"
        >
          {{ submitButtonText || $t('common.login') }}
        </VbenButton>
      </template>
      <template #smsCode>
        <AuthenticationCodeLogin
          :form-schema="props.smsFormSchema"
          :loading="smscodeLoading"
          @submit="handleSmsLogin"
          :active-tab-key="activeTabKey"
        />
      </template>
    </LoginTabs2>
    <div
      v-if="showCodeLogin || showQrcodeLogin"
      class="mb-2 mt-4 flex items-center justify-between"
    >
      <!-- <VbenButton
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
      </VbenButton> -->
    </div>

    <!-- 第三方登录 -->
    <slot name="third-party-login">
      <ThirdPartyLogin v-if="showThirdPartyLogin" />
    </slot>

    <slot name="to-register">
      <div v-if="showRegister" class="mt-3 text-center text-sm">
        {{ $t('authentication.accountTip') }}
        <span
          class="vben-link text-sm font-normal"
          @click="handleGo(registerPath)"
        >
          {{ $t('authentication.createAccount') }}
        </span>
      </div>
    </slot>
  </div>
</template>
