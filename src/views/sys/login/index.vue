<script lang="tsx">
  // 组件相关
  import { defineComponent } from 'compatible-vue';
  import LoginForm from './LoginForm.vue';

  // hook
  import { useDesign } from '@/hooks/core/useDesign';
  import { useSetting } from '@/hooks/core/useSetting';
  import logo from '@/assets/images/logo.png';

  export default defineComponent({
    name: 'Login',

    setup() {
      // 获取配置文件
      // 样式前缀
      const { prefixCls } = useDesign('login');
      const { globSetting } = useSetting();

      // 账号密码登录
      return () => {
        const { shortName, title } = globSetting;
        return (
          <div class={prefixCls}>
            <div class={`${prefixCls}-logo__wrap`}>
              <img class={`${prefixCls}__logo`} src={logo} alt={shortName} />
              <h2 class={`${prefixCls}__title`}>{title}</h2>
            </div>
            <div class={`${prefixCls}-form__wrap`}>
              <LoginForm />
            </div>
          </div>
        );
      };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '~@design';

  @prefix-cls: ~'@{namespace}-login';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background: url(~@/assets/images/login/logo-bg.png) no-repeat;
    background-size: 100% 100%;

    &-logo__wrap {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 30vw;
      height: 50vh;
      background: linear-gradient(-135deg, #64acff, darken(#64acff, 30%));
      border-radius: 10px 0 0 10px;
      .respond-to(xsmall-only, {display: none;});
      .respond-to(small-only, {display: none;});
      .respond-to(medium-only, {width: 40vw;});
    }

    &__logo {
      width: 50px;
      height: 44px;
    }

    &__title {
      margin: 0 0 0 16px;
      font: italic 2em Georgia, serif;
      font-size: 24px;
      letter-spacing: 0.2em;
      color: #fff;
    }

    &-form__wrap {
      display: flex;
      width: 30vw;
      height: 70vh;
      padding: 0 60px;
      background: #fff;
      border-radius: 10px;
      align-items: center;
      .respond-to(xsmall-only, { width: 60vw;});
      .respond-to(small-only, {width: 60vw;});
      .respond-to(medium-only, {width: 50vw;});
    }
  }
</style>
