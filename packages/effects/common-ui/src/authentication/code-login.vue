<script setup lang="ts">
import type { LoginCodeEmits } from './typings';

import { computed, onBeforeUnmount, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { VbenButton, VbenInput, VbenPinInput } from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';

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
  name: 'AuthenticationCodeLogin',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
});

const emit = defineEmits<{
  submit: LoginCodeEmits['submit'];
}>();

const router = useRouter();

const formState = reactive({
  code: '',
  phoneNumber: '',
  requirePhoneNumber: false,
  submitted: false,
});

const countdown = ref(0);
const timer = ref<ReturnType<typeof setTimeout>>();

const isValidPhoneNumber = computed(() => {
  return /^1[3-9]\d{9}$/.test(formState.phoneNumber);
});

const btnText = computed(() => {
  return countdown.value > 0
    ? $t('authentication.sendText', [countdown.value])
    : $t('authentication.sendCode');
});
const btnLoading = computed(() => {
  return countdown.value > 0;
});

const phoneNumberStatus = computed(() => {
  return (formState.submitted || formState.requirePhoneNumber) &&
    !isValidPhoneNumber.value
    ? 'error'
    : 'default';
});

const codeStatus = computed(() => {
  return formState.submitted && !formState.code ? 'error' : 'default';
});

function handleSubmit() {
  formState.submitted = true;
  if (phoneNumberStatus.value !== 'default' || codeStatus.value !== 'default') {
    return;
  }

  emit('submit', {
    code: formState.code,
    phoneNumber: formState.phoneNumber,
  });
}

function goToLogin() {
  router.push(props.loginPath);
}

async function handleSendCode() {
  if (btnLoading.value) {
    return;
  }
  if (!isValidPhoneNumber.value) {
    formState.requirePhoneNumber = true;
    return;
  }
  countdown.value = 60;
  // TODO: 调用发送验证码接口
  startCountdown();
}

function startCountdown() {
  if (countdown.value > 0) {
    timer.value = setTimeout(() => {
      countdown.value--;
      startCountdown();
    }, 1000);
  }
}

onBeforeUnmount(() => {
  countdown.value = 0;
  clearTimeout(timer.value);
});
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.welcomeBack') }} 📲
      <template #desc>
        <span class="text-muted-foreground">
          {{ $t('authentication.codeSubtitle') }}
        </span>
      </template>
    </Title>
    <VbenInput
      v-model="formState.phoneNumber"
      :autofocus="true"
      :error-tip="$t('authentication.mobile-tip')"
      :label="$t('authentication.mobile')"
      :placeholder="$t('authentication.mobile')"
      :status="phoneNumberStatus"
      name="phoneNumber"
      type="number"
      @keyup.enter="handleSubmit"
    />
    <VbenPinInput
      v-model="formState.code"
      :btn-loading="btnLoading"
      :btn-text="btnText"
      :code-length="4"
      :error-tip="$t('authentication.codeTip')"
      :handle-send-code="handleSendCode"
      :label="$t('authentication.code')"
      :placeholder="$t('authentication.code')"
      :status="codeStatus"
      name="password"
      @keyup.enter="handleSubmit"
    />
    <VbenButton :loading="loading" class="mt-2 w-full" @click="handleSubmit">
      {{ $t('common.login') }}
    </VbenButton>
    <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
      {{ $t('common.back') }}
    </VbenButton>
  </div>
</template>
