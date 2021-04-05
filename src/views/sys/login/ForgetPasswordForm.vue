<template>
  <template v-if="getShow">
    <LoginFormTitle class="enter-x" />
    <Form class="p-4 enter-x" :model="formData" :rules="getFormRules" ref="formRef">
      <FormItem name="account" class="enter-x">
        <Input
          size="large"
          v-model:value="formData.account"
          :placeholder="t('sys.login.userName')"
        />
      </FormItem>

      <FormItem name="mobile" class="enter-x">
        <Input size="large" v-model:value="formData.mobile" :placeholder="t('sys.login.mobile')" />
      </FormItem>
      <FormItem name="sms" class="enter-x">
        <CountdownInput
          size="large"
          v-model:value="formData.sms"
          :placeholder="t('sys.login.smsCode')"
        />
      </FormItem>

      <FormItem class="enter-x">
        <Button type="primary" size="large" block @click="handleReset" :loading="loading">
          {{ t('common.resetText') }}
        </Button>
        <Button size="large" block class="mt-4" @click="handleBackLogin">
          {{ t('sys.login.backSignIn') }}
        </Button>
      </FormItem>
    </Form>
  </template>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, computed, unref } from 'vue';

  import LoginFormTitle from './LoginFormTitle.vue';
  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { useLoginState, useFormRules, LoginStateEnum } from './useLogin';

  export default defineComponent({
    name: 'ForgetPasswordForm',
    components: {
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      CountdownInput,
      LoginFormTitle,
    },
    setup() {
      const { t } = useI18n();
      const { handleBackLogin, getLoginState } = useLoginState();
      const { getFormRules } = useFormRules();

      const formRef = ref();
      const loading = ref(false);

      const formData = reactive({
        account: '',
        mobile: '',
        sms: '',
      });

      const getShow = computed(() => unref(getLoginState) === LoginStateEnum.RESET_PASSWORD);

      async function handleReset() {
        const form = unref(formRef);
        if (!form) return;
        await form.resetFields();
      }

      return {
        t,
        formRef,
        formData,
        getFormRules,
        handleReset,
        loading,
        handleBackLogin,
        getShow,
      };
    },
  });
</script>
