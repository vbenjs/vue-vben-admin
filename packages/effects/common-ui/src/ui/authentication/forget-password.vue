<script setup lang="ts">
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { VbenButton, VbenInput } from '@vben-core/shadcn-ui';

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
  name: 'AuthenticationForgetPassword',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
});

const emit = defineEmits<{
  submit: [string];
}>();

const router = useRouter();
const formState = reactive({
  email: '',
  submitted: false,
});

const emailStatus = computed(() => {
  return formState.submitted && !formState.email ? 'error' : 'default';
});

function handleSubmit() {
  formState.submitted = true;
  if (emailStatus.value !== 'default') {
    return;
  }
  emit('submit', formState.email);
}

function goToLogin() {
  router.push(props.loginPath);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.forgetPassword') }} 🤦🏻‍♂️
      <template #desc>
        {{ $t('authentication.forgetPasswordSubtitle') }}
      </template>
    </Title>
    <div class="mb-6">
      <VbenInput
        v-model="formState.email"
        :error-tip="$t('authentication.emailTip')"
        :label="$t('authentication.email')"
        :status="emailStatus"
        autofocus
        name="email"
        placeholder="example@example.com"
        type="text"
      />
    </div>
    <div>
      <VbenButton class="mt-2 w-full" @click="handleSubmit">
        {{ $t('authentication.sendResetLink') }}
      </VbenButton>
      <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
        {{ $t('common.back') }}
      </VbenButton>
    </div>
  </div>
</template>
