<script setup lang="ts">
import type { VbenFormSchema } from '@vben-core/form-ui';

import type { LoginCodeEmits } from './types';

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

async function handleSubmit() {
  const { valid, values } = await validate();

  if (valid) {
    emit('submit', {
      code: values?.code,
      phoneNumber: values?.phoneNumber,
    });
  }
}

function goToLogin() {
  router.push(props.loginPath);
}
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
    <Form />
    <VbenButton :loading="loading" class="w-full" @click="handleSubmit">
      {{ $t('common.login') }}
    </VbenButton>
    <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
      {{ $t('common.back') }}
    </VbenButton>
  </div>
</template>
