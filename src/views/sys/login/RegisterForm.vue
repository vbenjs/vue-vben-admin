<template>
  <Form class="p-4" :model="formData" :rules="getFormRules" ref="formRef">
    <FormItem name="account" class="enter-x">
      <Input size="large" v-model:value="formData.account" :placeholder="t('sys.login.userName')" />
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
    <FormItem name="password" class="enter-x">
      <StrengthMeter
        size="large"
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>
    <FormItem name="confirmPassword" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.confirmPassword"
        :placeholder="t('sys.login.confirmPassword')"
      />
    </FormItem>

    <FormItem class="enter-x" name="policy">
      <!-- No logic, you need to deal with it yourself -->
      <Checkbox v-model:checked="formData.policy" size="small">
        {{ t('sys.login.policy') }}
      </Checkbox>
    </FormItem>

    <Button
      type="primary"
      size="large"
      block
      @click="handleReset"
      :loading="loading"
      class="enter-x"
    >
      {{ t('sys.login.registerButton') }}
    </Button>
    <Button size="large" block class="mt-4 enter-x" @click="handleBackLogin">
      {{ t('sys.login.backSignIn') }}
    </Button>
  </Form>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref } from 'vue';

  import { Form, Input, Button, Checkbox } from 'ant-design-vue';
  import { StrengthMeter } from '/@/components/StrengthMeter';
  import { CountdownInput } from '/@/components/CountDown';

  import { useI18n } from '/@/hooks/web/useI18n';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';

  export default defineComponent({
    name: 'RegisterPasswordForm',
    components: {
      Button,
      Form,
      FormItem: Form.Item,
      Input,
      InputPassword: Input.Password,
      Checkbox,
      StrengthMeter,
      CountdownInput,
    },
    setup() {
      const { t } = useI18n();
      const { setLoginState } = useLoginState();

      const formRef = ref<any>(null);
      const loading = ref(false);

      const formData = reactive({
        account: '',
        password: '',
        confirmPassword: '',
        mobile: '',
        sms: '',
        policy: false,
      });

      const { getFormRules } = useFormRules(formData);
      const { validForm } = useFormValid(formRef);

      async function handleReset() {
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
        handleReset,
        loading,
        handleBackLogin,
      };
    },
  });
</script>
