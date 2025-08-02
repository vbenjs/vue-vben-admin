<script lang="ts" setup>
import type {VbenFormSchema} from '@vben/common-ui';
import type {BasicOption} from '@vben/types';

import {computed, markRaw} from 'vue';

import {AuthenticationLogin, SliderCaptcha, z} from '@vben/common-ui';
import {$t} from '@vben/locales';

import {useAuthStore} from '#/store';

defineOptions({name: 'Login'});

const authStore = useAuthStore();

const MOCK_USER_OPTIONS: BasicOption[] = [
  {
    label: 'Super',
    value: 'vben',
  },
  {
    label: 'Admin',
    value: 'admin',
  },
  {
    label: 'User',
    value: 'jack',
  },
];


// 设置表单元素
const formSchema = computed((): VbenFormSchema[] => {
  return [
    // {
    //   component: 'VbenSelect',
    //   componentProps: {
    //     options: MOCK_USER_OPTIONS,
    //     placeholder: $t('authentication.selectAccount'),
    //   },
    //   fieldName: 'selectAccount',
    //   label: $t('authentication.selectAccount'),
    //   rules: z
    //     .string()
    //     .min(1, { message: $t('authentication.selectAccount') })
    //     .optional()
    //     .default('vben'),
    // },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      dependencies: {
        trigger(values, form) {
          form.setValues({
            password: '000223ljk',
            account: 'yinheyibei',
          });
        },
        triggerFields: ['selectAccount'],
      },

      fieldName: 'account',
      label: $t('authentication.username'),
      rules: z.string().min(1, {message: $t('authentication.usernameTip')}),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, {message: $t('authentication.passwordTip')}),
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
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    @submit="authStore.authLogin"
  />
</template>
