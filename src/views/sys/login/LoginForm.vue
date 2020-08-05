<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { SvgIcon } from '@/components/icon/index';

  import { BasicForm, useForm } from '@/components/form/index';
  import { useModal } from '@/components/modal/index';
  import { VerifyModal } from '@/components/verify/index';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useEvent } from '@/hooks/event/useEvent';

  import { userStore } from '@/store/modules/user';
  import { clearAll } from '@/store/persistent';

  import headImg from '@/assets/images/header.jpg';
  export default defineComponent({
    name: 'LoginForm',

    setup() {
      userStore.loginOut();
      // 按钮加载
      const loadingRef = ref(false);

      const { prefixCls } = useDesign('login-form');

      const [registerModal, { openModal, isFirstLoadRef }] = useModal();
      const [register, { validateFields, getFieldsValue }] = useForm({
        size: 'large',
        // 隐藏按钮
        showActionButtonGroup: false,
        // 表单项
        schemas: [
          {
            field: 'username',
            label: '用户名',
            component: 'Input',
            componentProps: {
              placeholder: 'admin',
            },
            rules: [{ required: true }],
            renderComponentContent: () => {
              return [<SvgIcon type="account" slot="addonBefore" />];
            },
          },
          {
            field: 'password',
            label: '密码',
            component: 'InputPassword',
            componentProps: {
              placeholder: '123456',
            },
            rules: [{ required: true }],
            renderComponentContent: () => {
              return [<SvgIcon type="password" slot="addonBefore" />];
            },
          },
        ],
      });

      /**
       * @description: 用户登陆
       */
      async function handleLogin() {
        // 表单校验
        const { err } = await validateFields();
        if (err) {
          return;
        }
        openModal({
          visible: true,
        });
      }
      async function handleVerifySuccess() {
        try {
          openModal({
            visible: false,
          });
          loadingRef.value = true;
          // 表单校验
          const values = getFieldsValue() as any;
          await userStore.login(values);
        } catch (e) {
          clearAll();
        } finally {
          loadingRef.value = false;
        }
      }
      useEvent({
        el: document,
        name: 'keyup',
        listener: (e: KeyboardEvent) => {
          // 回车⌚️
          if (e.keyCode === 13) {
            handleLogin();
          }
        },
      });
      return () => (
        <div class={prefixCls}>
          <h1>系统登陆</h1>
          {!unref(isFirstLoadRef) && (
            <VerifyModal src={headImg} onRegister={registerModal} onSuccess={handleVerifySuccess} />
          )}
          <BasicForm onRegister={register} />

          <a-button
            type="primary"
            size="large"
            loading={unref(loadingRef)}
            block
            class="mt-2"
            onClick={handleLogin}
          >
            登陆
          </a-button>
        </div>
      );
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-login-form';

  .@{prefix-cls} {
    width: 100%;

    h1 {
      width: 100%;
      margin-bottom: 30px;
      font-weight: normal;
      letter-spacing: 0.2em;
      text-align: center;
    }
  }
</style>
