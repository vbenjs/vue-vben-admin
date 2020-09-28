<template>
  <div class="login h-screen relative">
    <div class="login-mask h-full hidden lg:block" />
    <div
      class="h-full absolute right-0 top-0 w-full lg:w-2/5 xl:w-1/3 flex justify-center items-center"
    >
      <div class="login-form bg-white w-full rounded-sm border-solid bg-clip-padding mx-6 xl:mx-14">
        <div class="w-full h-full border border-gray-600 px-2 py-10 rounded-sm">
          <header class="flex justify-center items-center">
            <img src="/@/assets/images/logo.png" class="w-12 mr-4 inline-block" />
            <h1 class="text-2xl text-center text-primary tracking-wide">Vben Admin 2.0</h1>
          </header>

          <a-form class="w-4/5 mx-auto mt-10" :model="formData" :rules="formRules" ref="formRef">
            <a-form-item name="account">
              <a-input size="large" v-model:value="formData.account" placeholder="vben" />
            </a-form-item>
            <a-form-item name="password">
              <a-input-password
                autofocus="autofocus"
                size="large"
                visibilityToggle
                v-model:value="formData.password"
                placeholder="123456"
              />
            </a-form-item>
            <a-form-item name="verify" v-if="openLoginVerify">
              <BasicDragVerify v-model:value="formData.verify" ref="verifyRef" />
            </a-form-item>
            <a-form-item>
              <a-button
                type="primary"
                size="large"
                class="rounded-sm"
                block
                @click="login"
                :loading="formState.loading"
                >登录</a-button
              >
            </a-form-item>
          </a-form>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, reactive, ref, unref, toRaw, computed } from 'vue';
  import { BasicDragVerify, DragVerifyActionType } from '/@/components/Verify/index';
  import { userStore } from '/@/store/modules/user';
  import { appStore } from '/@/store/modules/app';
  import { useMessage } from '/@/hooks/web/useMessage';
  export default defineComponent({
    components: { BasicDragVerify },
    setup() {
      const { notification } = useMessage();
      const formRef = ref<any>(null);
      const verifyRef = ref<RefInstanceType<DragVerifyActionType>>(null);

      const openLoginVerifyRef = computed(() => appStore.getProjectConfig.openLoginVerify);

      const formData = reactive({
        account: '',
        password: '',
        verify: undefined,
      });
      const formState = reactive({
        loading: false,
      });

      const formRules = reactive({
        account: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        verify: unref(openLoginVerifyRef) ? [{ required: true, message: '请通过验证码校验' }] : [],
      });

      function resetVerify() {
        const verify = unref(verifyRef);
        if (!verify) return;
        formData.verify && verify.$.resume();
        formData.verify = undefined;
      }

      async function handleLogin() {
        const form = unref(formRef);
        if (!form) return;
        formState.loading = true;
        try {
          const data = await form.validate();
          const userInfo = await userStore.login(
            toRaw({
              password: data.password,
              username: data.account,
            })
          );
          if (userInfo) {
            notification.success({
              message: '登录成功',
              description: `欢迎回来: ${userInfo.realName}`,
              duration: 3,
            });
          }
        } catch (error) {
        } finally {
          resetVerify();
          formState.loading = false;
        }
      }

      return {
        formRef,
        verifyRef,
        formData,
        formState,
        formRules,
        login: handleLogin,
        openLoginVerify: openLoginVerifyRef,
      };
    },
  });
</script>
<style lang="less" scoped>
  .login {
    background: url(../../../assets/images/login/login-bg.png) no-repeat;
    background-size: 100% 100%;

    &-mask {
      background: url(../../../assets/images/login/login-in.png) no-repeat;
      background-size: 100% 100%;
    }

    &-form {
      border-color: rgba(255, 255, 255, 0.5);
      border-width: 10px;
    }
  }
</style>
