<template>
  <LoginFormTitle v-show="getShow" class="enter-x" />
  <Form
    class="p-4 enter-x"
    :model="formData"
    :rules="getFormRules"
    ref="formRef"
    v-show="getShow"
    @keypress.enter="handleLogin"
  >
    <FormItem name="account" class="enter-x">
      <Input
        size="large"
        v-model:value="formData.account"
        :placeholder="t('sys.login.userName')"
        class="fix-auto-fill"
      >
        <template #prefix>
          <Icon icon="ant-design:user-outline" :size="18" class="mr-1" />
        </template>
      </Input>
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
        autocomplete="autocomplete"
      >
        <template #prefix>
          <Icon icon="ant-design:lock-outline" :size="18" class="mr-1" />
        </template>
      </InputPassword>
    </FormItem>
    <FormItem name="code" class="enter-x" v-if="codeData.isShowVerifyCode">
      <div class="flex">
        <Input
          style="width: calc(100% - 108px); min-width: 0 !important"
          size="large"
          v-model:value="formData.code"
        />
        <img
          @click="showVerifyCode"
          v-if="codeData.verifyCodeUrl"
          :src="codeData.verifyCodeUrl"
          style="display: inline-block; height: 40.14px"
        />
      </div>
    </FormItem>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
    </FormItem>
    <!-- <ARow class="enter-x">
      <ACol :span="24" class="!my-2 !md:my-0">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
    </ARow> -->
  </Form>
</template>
<script lang="ts" setup>
  import { reactive, ref, unref, computed } from 'vue';

  import { Form, Input, Button, message } from 'ant-design-vue';
  import LoginFormTitle from './LoginFormTitle.vue';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useLoginState, useFormRules, useFormValid } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { TOKEN_KEY } from '@/enums/cacheEnum';
  import { getVerifyCode } from '@/api/system/user';
  import Icon from '@/components/Icon/Icon.vue';
  //import { onKeyStroke } from '@vueuse/core';

  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const codeData = reactive({
    verifyCodeUrl: '',
    isShowVerifyCode: false,
  });
  const formData = reactive({
    account: '',
    password: '',
    code: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  const showVerifyCode = async () => {
    codeData.isShowVerifyCode = true;
    const res = await getVerifyCode();
    const blob = new Blob([res.data], { type: 'image/jpeg' });
    const token = res.headers[TOKEN_KEY] || res.headers['x-ymk-token'];
    useUserStore().setToken(token);
    codeData.verifyCodeUrl = window.URL.createObjectURL(blob);
  };
  async function handleLogin() {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const { code, msg } = await userStore.login({
        password: data.password,
        username: data.account,
        code: data.code,
        mode: 'none', //不要默认的错误提示
      });
      switch (code) {
        case 0:
          const { name } = useUserStore().getUserInfo;
          notification.success({
            message: t('sys.login.loginSuccessTitle'),
            description: `${t('sys.login.loginSuccessDesc')}: ${name}`,
            duration: 3,
          });
          break;
        case 9001: // 用户名密码错误
          message.error(msg);
          codeData.isShowVerifyCode && showVerifyCode();
          break;
        case 9002:
          break;
        case 9003: // 请输入图片验证码
          message.error(msg);
          showVerifyCode();
          break;
        case 9004: // 图片验证码错误
          message.error(msg);
          showVerifyCode();
          break;
        case 9009: // 账号/密码错误
          message.error(msg);
          codeData.isShowVerifyCode && showVerifyCode();
          break;
        default:
          createErrorModal({ title: '错误', content: msg });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
    } finally {
      loading.value = false;
    }
  }
</script>
