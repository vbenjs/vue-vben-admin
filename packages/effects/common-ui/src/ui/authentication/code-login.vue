<script setup lang="ts">
import type { Recordable } from '@vben/types';

import type { VbenFormSchema } from '@vben-core/form-ui';

import { computed, reactive, watch } from 'vue';

import { $t } from '@vben/locales';

import { useVbenForm } from '@vben-core/form-ui';
import { VbenButton } from '@vben-core/shadcn-ui';

// import Title from './auth-title.vue';

interface Props {
  formSchema: VbenFormSchema[];
  /**
   * @zh_CN 是否处于加载处理状态
   */
  loading?: boolean;
  /**
   * @zh_CN 登录路径
   */
  loginPath?: string;
  /**
   * @zh_CN 标题
   */
  title?: string;
  /**
   * @zh_CN 描述
   */
  subTitle?: string;
  /**
   * @zh_CN 按钮文本
   */
  submitButtonText?: string;

  /**
   * @zh_CN 当前激活的标签键
   */
  activeTabKey?: string;
}

defineOptions({
  name: 'AuthenticationCodeLogin',
});

const props = withDefaults(defineProps<Props>(), {
  loading: false,
  loginPath: '/auth/login',
  submitButtonText: '',
  subTitle: '',
  title: '',
  activeTabKey: '',
});

const emit = defineEmits<{
  submit: [Recordable<any>];
}>();

// const router = useRouter();

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

watch(
  () => props.activeTabKey,
  (newKey: string) => {
    if (newKey) {
      formApi.resetValidate();
    }
  },
  { immediate: true },
);

async function handleSubmit() {
  const { valid } = await formApi.validate();
  const values = await formApi.getValues();
  if (valid) {
    emit('submit', values);
  }
}
// const notReceiveCode = () => {
//   console.warn('收不到验证码，请联系管理员或尝试其他登录方式。');
// };

// function goToLogin() {
//   router.push(props.loginPath);
// }

defineExpose({
  getFormApi: () => formApi,
});
</script>

<template>
  <div class="w-full">
    <Form />
    <!-- <div class="mb-6 flex justify-end">
      <span
        class="not-receive-text text-sm font-normal"
        @click="notReceiveCode"
      >
        收不到验证码？
      </span>
    </div> -->

    <VbenButton
      :class="{
        'cursor-wait': loading,
      }"
      :loading="loading"
      class="h-10 w-full"
      @click="handleSubmit"
    >
      <slot name="submitButtonText">
        {{ submitButtonText || $t('common.login') }}
      </slot>
    </VbenButton>
    <!-- <VbenButton class="mt-4 w-full" variant="outline" @click="goToLogin()">
      {{ $t('common.back') }}
    </VbenButton> -->
  </div>
</template>
<style scoped lang="scss">
.not-receive-text {
  color: hsl(227deg 13% 57%);
  cursor: pointer;
}
</style>
