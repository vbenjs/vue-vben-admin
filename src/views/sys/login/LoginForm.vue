<script lang="tsx">
  import { defineComponent, ref, unref } from 'compatible-vue';
  import { SvgIcon } from '@/components/icon/index';
  import { Button } from 'ant-design-vue';
  import { BasicForm, useForm } from '@/components/form/index';
  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useEvent } from '@/hooks/event/useEvent';

  import { userStore } from '@/store/modules/user';
  export default defineComponent({
    name: 'LoginForm',

    setup() {
      userStore.loginOut();
      // 按钮加载
      const loadingRef = ref(false);

      const { prefixCls } = useDesign('login-form');

      const [register, { validateFields }] = useForm({
        size: 'large',
        // 隐藏按钮
        showActionButtonGroup: false,
        // 表单项
        schemas: [
          {
            field: 'username',
            label: '用户名',
            component: 'Input',
            defaultValue: 'admin',
            componentProps: {
              placeholder: '',
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
            defaultValue: '123456',
            componentProps: {
              placeholder: '请输入密码',
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
        try {
          loadingRef.value = true;
          // 表单校验
          const { err, values } = await validateFields();
          if (err) {
            return;
          }
          await userStore.login(values);
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
        autoRemove: true,
      });

      return () => (
        <div class={prefixCls}>
          <h1>系统登陆</h1>

          <BasicForm onRegister={register} />

          <Button
            type="primary"
            size="large"
            loading={unref(loadingRef)}
            block
            class="mt-2"
            onClick={handleLogin}
          >
            登陆
          </Button>
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
