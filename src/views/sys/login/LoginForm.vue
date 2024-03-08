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
      />
    </FormItem>
    <FormItem name="password" class="enter-x">
      <InputPassword
        size="large"
        visibilityToggle
        v-model:value="formData.password"
        :placeholder="t('sys.login.password')"
      />
    </FormItem>

    <!--  文本验证码  -->
    <ARow v-if="computedCaptchaIdent == 'TEXT'" :gutter="16">
      <ACol :span="16">
        <FormItem name="captcha">
          <Input
            v-model:value="formData.captcha"
            class="login-captcha"
            :placeholder="t('system.login.login-captcha')"
            size="large"
          />
        </FormItem>
      </ACol>
      <ACol :span="8">
        <TextCaptcha ref="captchaRef" height="40px" :api="getCaptchaApi" />
      </ACol>
    </ARow>

    <ARow class="enter-x">
      <ACol :span="12">
        <FormItem>
          <!-- No logic, you need to deal with it yourself -->
          <Checkbox v-model:checked="rememberMe" size="small">
            {{ t('sys.login.rememberMe') }}
          </Checkbox>
        </FormItem>
      </ACol>
      <ACol :span="12">
        <FormItem :style="{ 'text-align': 'right' }">
          <!-- No logic, you need to deal with it yourself -->
          <Button type="link" size="small" @click="setLoginState(LoginStateEnum.RESET_PASSWORD)">
            {{ t('sys.login.forgetPassword') }}
          </Button>
        </FormItem>
      </ACol>
    </ARow>

    <FormItem class="enter-x">
      <Button type="primary" size="large" block @click="handleLogin" :loading="loading">
        {{ t('sys.login.loginButton') }}
      </Button>
      <!-- <Button size="large" class="mt-4 enter-x" block @click="handleRegister">
        {{ t('sys.login.registerButton') }}
      </Button> -->
    </FormItem>
    <ARow class="enter-x" :gutter="[16, 16]">
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.MOBILE)">
          {{ t('sys.login.mobileSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.QR_CODE)">
          {{ t('sys.login.qrSignInFormTitle') }}
        </Button>
      </ACol>
      <ACol :md="8" :xs="24">
        <Button block @click="setLoginState(LoginStateEnum.REGISTER)">
          {{ t('sys.login.registerButton') }}
        </Button>
      </ACol>
    </ARow>

    <Divider class="enter-x">{{ t('sys.login.otherSignIn') }}</Divider>

    <div class="flex justify-evenly enter-x" :class="`${prefixCls}-sign-in-way`">
      <GithubFilled />
      <WechatFilled />
      <AlipayCircleFilled />
      <GoogleCircleFilled />
      <TwitterCircleFilled />
    </div>

    <ImageCaptchaModal
      ref="captchaRef"
      @register="registerImageCaptchaModal"
      v-if="computedCaptchaIdent == 'IMAGE'"
      @end="handleImageCaptchaEnd"
      :type="computedCaptchaType"
    />
  </Form>
</template>
<script lang="ts" setup>
  import { computed, reactive, ref, unref } from 'vue';

  import { Button, Checkbox, Col, Divider, Form, Input, Row } from 'ant-design-vue';
  import {
    AlipayCircleFilled,
    GithubFilled,
    GoogleCircleFilled,
    TwitterCircleFilled,
    WechatFilled,
  } from '@ant-design/icons-vue';
  import LoginFormTitle from './LoginFormTitle.vue';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useMessage } from '@/hooks/web/useMessage';

  import { useUserStore } from '@/store/modules/user';
  import { LoginStateEnum, useFormRules, useFormValid, useLoginState } from './useLogin';
  import { useDesign } from '@/hooks/web/useDesign';
  import { ApiServiceEnum, defHttp } from '@/utils/http/axios';
  import { createPassword } from '@/utils/auth';
  import { useAppStore } from '@/store/modules/app';
  import { TextCaptcha, ImageCaptchaModal, ImageCaptchaType } from '@/components/Verify';
  import { useModal } from '@/components/Modal';
  //import { onKeyStroke } from '@vueuse/core';

  const captchaRef = ref();

  const ACol = Col;
  const ARow = Row;
  const FormItem = Form.Item;
  const InputPassword = Input.Password;
  const { t } = useI18n();
  const { notification, createErrorModal } = useMessage();
  const { prefixCls } = useDesign('login');
  const userStore = useUserStore();
  const appStore = useAppStore();

  const { setLoginState, getLoginState } = useLoginState();
  const { getFormRules } = useFormRules();

  const formRef = ref();
  const loading = ref(false);
  const rememberMe = ref(false);

  /**
   * 是否使用验证码
   */
  const computedCaptchaIdent = computed(() => {
    return appStore.systemProperties.captchaIdent;
  });

  const computedCaptchaType = computed<ImageCaptchaType>(() => {
    return appStore.systemProperties.captchaType as ImageCaptchaType;
  });

  const [registerImageCaptchaModal, { openModal: openImageCaptchaModal }] = useModal();

  const formData = reactive({
    account: 'admin',
    password: '123456',
    captcha: '',
  });

  const { validForm } = useFormValid(formRef);

  //onKeyStroke('Enter', handleLogin);

  const getShow = computed(() => unref(getLoginState) === LoginStateEnum.LOGIN);

  async function handleLogin() {
    if (unref(computedCaptchaIdent) === 'IMAGE') {
      const data = await validForm();
      if (!data) return;
      openImageCaptchaModal();
      return;
    }
    let code = '';
    if (unref(computedCaptchaIdent) === 'TEXT') {
      code = JSON.stringify(unref(captchaRef).createValidateParameter(formData.captcha));
    }
    doLogin(code);
  }

  const handleImageCaptchaEnd = (parameter) => {
    const code = JSON.stringify(parameter);
    doLogin(code);
  };

  const doLogin = async (code: string) => {
    const data = await validForm();
    if (!data) return;
    try {
      loading.value = true;
      const userInfo = await userStore.login({
        password: createPassword(data.account, data.password),
        username: data.account,
        mode: 'none', //不要默认的错误提示
        code,
      });
      if (userInfo) {
        notification.success({
          message: t('sys.login.loginSuccessTitle'),
          description: `${t('sys.login.loginSuccessDesc')}: ${userInfo.realName}`,
          duration: 3,
        });
      }
    } catch (error) {
      createErrorModal({
        title: t('sys.api.errorTip'),
        content: (error as unknown as Error).message || t('sys.api.networkExceptionMsg'),
        // getContainer: () => document.body.querySelector(`.${prefixCls}`) || document.body,
      });
      unref(captchaRef).refresh();
    } finally {
      loading.value = false;
    }
  };

  const getCaptchaApi = () => {
    return defHttp.post({
      service: ApiServiceEnum.SMART_AUTH,
      url: 'auth/createCaptcha',
    });
  };
</script>
