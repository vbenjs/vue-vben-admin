<script setup lang="ts">
import type { VbenFormSchema } from '@vben-core/form-ui';

import type { RegisterEmits } from './types';

import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import { $t } from '@vben/locales';
import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton } from '@vben-core/shadcn-ui';

import Title from './auth-title.vue';

interface Props {
  formSchema: VbenFormSchema[];
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
  formSchema: () => [],
  loading: false,
  loginPath: '/auth/login',
});

const emit = defineEmits<{
  submit: RegisterEmits['submit'];
}>();

const [Form, { validate }] = useVbenForm(
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

async function handleSubmit() {
  const { valid, values } = await validate();
  if (valid) {
    emit('submit', values as { password: string; username: string });
  }
}

function goToLogin() {
  router.push(props.loginPath);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.createAnAccount') }} 🚀
      <template #desc> {{ $t('authentication.signUpSubtitle') }} </template>
    </Title>
    <Form />

    <VbenButton :loading="loading" class="mt-2 w-full" @click="handleSubmit">
      {{ $t('authentication.signUp') }}
    </VbenButton>
    <div class="mt-4 text-center text-sm">
      {{ $t('authentication.alreadyHaveAccount') }}
      <span
        class="text-primary hover:text-primary-hover cursor-pointer text-sm font-normal"
        @click="goToLogin()"
      >
        {{ $t('authentication.goToLogin') }}
      </span>
    </div>
  </div>
</template>
