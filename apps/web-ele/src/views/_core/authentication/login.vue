<script lang="ts" setup>
import type { VbenFormSchema } from '@vben/common-ui';

import { computed } from 'vue';

import { AuthenticationLogin, z } from '@vben/common-ui';
import { $t } from '@vben/locales';

import { useAuthStore } from '#/store';

defineOptions({ name: 'Login' });

const authStore = useAuthStore();

// const MOCK_USER_OPTIONS: BasicOption[] = [
//   {
//     label: '系统管理员',
//     value: 'admin',
//   },
//   {
//     label: '普通用户',
//     value: 'user',
//   },
//   {
//     label: '测试账号',
//     value: 'test',
//   },
// ];

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
    //     .default('admin'),
    // },
    {
      component: 'VbenInput',
      componentProps: {
        placeholder: $t('authentication.usernameTip'),
      },
      // dependencies: {
      // trigger(values, form) {
      // if (values.selectAccount) {
      //   const findUser = MOCK_USER_OPTIONS.find(
      //     (item) => item.value === values.selectAccount,
      //   );
      //   if (findUser) {
      //     // 根据不同账号设置不同密码
      //     const passwordMap: Record<string, string> = {
      //       admin: 'admin123',
      //       user: 'user123',
      //       test: 'test123',
      //     };
      //     form.setValues({
      //       password: passwordMap[findUser.value] || '123456',
      //       username: findUser.value,
      //     });
      //   }
      // }
      // },
      // triggerFields: ['selectAccount'],
      // },
      fieldName: 'username',
      label: $t('authentication.username'),
      rules: z.string().min(1, { message: $t('authentication.usernameTip') }),
    },
    {
      component: 'VbenInputPassword',
      componentProps: {
        placeholder: $t('authentication.password'),
      },
      fieldName: 'password',
      label: $t('authentication.password'),
      rules: z.string().min(1, { message: $t('authentication.passwordTip') }),
    },
    // {
    //   component: markRaw(SliderTranslateCaptcha),
    //   fieldName: 'captcha',
    //   rules: z.boolean().refine((value) => value, {
    //     message: $t('authentication.verifyRequiredTip'),
    //   }),
    // },
  ];
});
</script>

<template>
  <AuthenticationLogin
    :form-schema="formSchema"
    :loading="authStore.loginLoading"
    :show-forget-password="false"
    :show-third-party-login="false"
    :show-register="false"
    :show-code-login="false"
    :show-qrcode-login="false"
    @submit="authStore.authLogin"
  />
</template>
