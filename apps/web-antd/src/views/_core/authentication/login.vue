<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';
import type { BasicOption } from '@vben/types';

import { computed, markRaw } from 'vue';

import { AuthenticationLogin, SliderCaptcha, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useQuery } from '@tanstack/vue-query';

import { getLoginContextApi } from '#/api';
import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();
const currentYear = `${new Date().getFullYear()}`;

/**
 * 使用 Vue Query 获取登录上下文配置
 * - 自动管理 loading/error/data 状态
 * - 内置缓存去重：同一时间多次挂载不会发送重复请求
 * - 窗口聚焦时自动静默刷新（由全局 QueryClient 配置控制）
 */
const {
  data: loginContext,
  isLoading: loginContextLoading,
  isSuccess: loginContextReady,
} = useQuery({
  queryKey: ['loginContext'],
  queryFn: () => getLoginContextApi(),
  // 登录上下文数据变化频率低，缓存 5 分钟
  staleTime: 5 * 60 * 1000,
});

/**
 * 从 Vue Query 缓存数据中派生出各表单选项
 * 保留原有的数据转换逻辑，仅改变数据来源
 */
const defaultFiscalYear = computed(
  () => loginContext.value?.defaultFiscalYear || currentYear,
);

const defaultTenantId = computed(() => loginContext.value?.defaultTenantId);

const fiscalYearOptions = computed<BasicOption[]>(() => {
  const years = loginContext.value?.fiscalYears;
  return years?.length
    ? years
    : [{ label: `${currentYear}年度`, value: currentYear }];
});

const tenantOptions = computed<BasicOption[]>(() => {
  const data = loginContext.value;
  if (!data?.tenants?.length) return [];
  return data.tenants.map((item: BasicOption) => ({
    ...item,
    label:
      `${item.value}` === `${data.defaultTenantId}`
        ? `${item.label}（默认账套）`
        : item.label,
  }));
});

const formSchema = computed((): VbenFormSchema[] => {
  const tenantRequired = tenantOptions.value.length > 0;

  return [
    {
      component: 'VbenSelect',
      componentProps: {
        allowClear: false,
        loading: loginContextLoading.value,
        options: fiscalYearOptions.value,
        placeholder: '请选择年度',
      },
      defaultValue: defaultFiscalYear.value,
      fieldName: 'fiscalYear',
      label: '年度',
      rules: z
        .string()
        .min(1, { message: '请选择年度' })
        .default(defaultFiscalYear.value),
    },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      defaultValue: 'admin',
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      defaultValue: '123456',
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    {
      component: 'VbenSelect',
      componentProps: {
        allowClear: false,
        loading: loginContextLoading.value,
        options: tenantOptions.value,
        placeholder: '请选择账套',
      },
      defaultValue: defaultTenantId.value,
      fieldName: 'tenantId',
      label: '账套',
      rules: z
        .any()
        .refine(
          (value) => !tenantRequired || `${value ?? ''}`.trim().length > 0,
          { message: '请选择账套' },
        ),
    },
    {
      component: markRaw(SliderCaptcha),
      fieldName: 'captcha',
      rules: z.boolean().refine((value) => value, {
        message: $t('authentication.verifyRequiredTip'),
      }),
    },
  ];
});
</script>

<template>
  <AuthenticationLogin
    v-if="loginContextReady"
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
