<script setup lang="ts">
import { VbenButton, VbenInput } from '@vben-core/shadcn-ui';

import { $t } from '@vben/locales';
import { computed, reactive } from 'vue';
import { useRouter } from 'vue-router';

import Title from './auth-title.vue';

interface Props {
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
}

defineOptions({
  name: 'AuthenticationForgetPassword',
});

withDefaults(defineProps<Props>(), {
  loading: false,
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

function handleSubmut() {
  formState.submitted = true;
  if (emailStatus.value !== 'default') {
    return;
  }
  emit('submit', formState.email);
}

function handleGo(path: string) {
  router.push(path);
}
</script>

<template>
  <div>
    <Title>
      {{ $t('authentication.forget-password') }} 🤦🏻‍♂️
      <template #desc>
        {{ $t('authentication.forget-password-subtitle') }}
      </template>
    </Title>
    <div class="mb-6">
      <VbenInput
        v-model="formState.email"
        :status="emailStatus"
        :error-tip="$t('authentication.email-tip')"
        :label="$t('authentication.email')"
        name="email"
        autofocus
        placeholder="example@example.com"
        type="text"
      />
    </div>
    <div>
      <VbenButton class="mt-2 w-full" @click="handleSubmut">
        {{ $t('authentication.send-reset-link') }}
      </VbenButton>
      <VbenButton
        class="mt-4 w-full"
        variant="outline"
        @click="handleGo('/auth/login')"
      >
        {{ $t('common.back') }}
      </VbenButton>
    </div>
  </div>
</template>
