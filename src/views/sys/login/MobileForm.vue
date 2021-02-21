<template>
  <Form class="p-4" :model="formData" :rules="getFormRules" ref="formRef">
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
      <Button
        type="primary"
        size="large"
        block
        @click="handleLogin"
        :loading="loading"
        class="enter-x"
      >
        {{ t('sys.login.loginButton') }}
      </Button>
      <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
        {{ t('sys.login.backSignIn') }}
      </Button>
    </FormItem>
  </Form>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import { Form, Input, Button } from 'ant-design-vue';
  import { CountdownInput } from '/@/components/CountDown';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';

  export default defineComponent({
    name: 'MobileForm',
    components: {
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      CountdownInput,
    },
    setup() {
      const { t } = useI18n();
      const { setLoginState } = useLoginState();
      const { getFormRules } = useFormRules();

      const formRef = ref<any>(null);
      const loading = ref(false);

      const formData = reactive({
        mobile: '',
        sms: '',
      });

      const { validForm } = useFormValid(formRef);

      async function handleLogin() {
        const data = await validForm();
        if (!data) return;
        console.log(data);
      }

      function handleBackLogin() {
        setLoginState(LoginStateEnum.LOGIN);
      }

      return {
        t,
        formRef,
        formData,
        getFormRules,
        handleLogin,
        loading,
        handleBackLogin,
      };
    },
  });
</script>
