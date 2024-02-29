<template>
  <div :class="prefixCls" class="relative w-full h-full px-4">
    <div class="container relative h-full py-2 mx-auto">
      <div class="flex h-full">
        <div class="hidden min-h-full pl-4 mr-4 xl:flex xl:w-1/2 2xl:w-8/14">
          <div></div>
        </div>
        <div
          class="xl:relative flex flex-col justify-center items-center w-full h-full py-5 xl:h-auto xl:py-0 xl:my-0 xl:w-1/2 2xl:w-6/14"
        >
          <img
            src="~@/assets/images/logo.png"
            class="enter-x absolute w-50 top-50px xl:top-12vh xl:left-45"
          />

          <div
            :class="`${prefixCls}-form`"
            class="relative w-full px-5 py-8 mx-auto my-auto shadow-md mt-80 xl:mt-90 xl:ml-16 xl:bg-transparent sm:px-8 xl:p-4 xl:shadow-none sm:w-3/4 lg:w-2/4 xl:w-auto enter-x"
          >
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
  import LoginForm from './LoginForm.vue';
  import { useDesign } from '@/hooks/web/useDesign';

  defineProps({
    sessionTimeout: {
      type: Boolean,
    },
  });

  const { prefixCls } = useDesign('login');
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-login';
  @logo-prefix-cls: ~'@{namespace}-app-logo';
  @countdown-prefix-cls: ~'@{namespace}-countdown-input';
  @dark-bg: #293146;

  html[data-theme='dark'] {
    .@{prefix-cls} {
      background-color: @dark-bg;

      &::before {
        background-image: url('@/assets/images/bg.png');
      }

      .ant-input,
      .ant-input-password {
        background-color: #232a3b;
      }

      .ant-btn:not(.ant-btn-link):not(.ant-btn-primary) {
        border: 1px solid #4a5569;
      }

      &-form {
        background: transparent !important;
      }

      .app-iconify {
        color: #fff;
      }
    }

    input.fix-auto-fill,
    .fix-auto-fill input {
      -webkit-text-fill-color: #c9d1d9 !important;
      box-shadow: inherit !important;
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 12px;
    }
  }

  .@{prefix-cls} {
    min-height: 100%;
    overflow: hidden;

    @media (max-width: @screen-xl) {
      // background-color: #293146;
      background-image: url('@/assets/images/bg_md.png');
      background-repeat: no-repeat;
      background-position: 100%;
      background-size: 100% 100%;

      // .@{prefix-cls}-form {
      //   background-color: #fff;
      // }
    }

    &::before {
      // background-size: 100% 100%;
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url('@/assets/images/bg.png');
      background-repeat: repeat;
      background-position: center center;
      background-size: cover;

      @media (max-width: @screen-xl) {
        display: none;
      }
    }

    canvas {
      position: absolute;
      top: 0;
      left: 0;
    }

    &-title {
      display: flex;
      position: fixed;
      top: 0;
      left: 0;
      align-items: center;
      justify-content: center;
      width: 100%;
    }

    &-images {
      position: relative;
      width: 100%;
      height: 100%;

      &-logo {
        display: flex;
        position: absolute;
        top: 0;
        left: 0;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;

        img {
          z-index: 200;
          width: 50%;
        }
      }

      .lbx-img {
        display: flex;
        position: absolute;
        top: 0;
        left: 0%;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        // animation: myfirst2 15s infinite linear;

        img {
          width: 100%;
        }
      }
    }

    &-form {
      &::before {
        content: '';
        position: absolute;
        top: -24%;
        left: -28%;
        width: 164%;
        height: 164%;
        background-image: url('@/assets/images/login-form.png');
        background-repeat: no-repeat;
        background-position: 100% 100%;
        background-size: 100% 100%;
        // @media (max-width: @screen-xl) {
        //   display: none;
        // }
      }

      input:-webkit-autofill {
        border: 0;
        box-shadow: 0 0 0 1000px #14699e inset !important;
      }

      .ant-input-password-large {
        border: 0;
        background-color: #14699e !important;
        color: #fff;
      }

      .ant-input,
      .ant-input-affix-wrapper {
        border: 0;
        background-color: #14699e !important;
        color: #fff;
      }

      svg {
        color: #fff;
      }
    }

    .@{logo-prefix-cls} {
      position: absolute;
      top: 12px;
      height: 30px;

      &__title {
        color: #fff;
        font-size: 16px;
      }

      img {
        width: 32px;
      }
    }

    .container {
      .@{logo-prefix-cls} {
        display: flex;
        width: 80%;
        height: 80px;

        &__title {
          color: #fff;
          font-size: 24px;
        }

        img {
          width: 48px;
        }
      }
    }

    &-sign-in-way {
      .anticon {
        color: #888;
        font-size: 22px;
        cursor: pointer;

        &:hover {
          color: @primary-color;
        }
      }
    }

    input:not([type='checkbox']) {
      min-width: 360px;

      @media (max-width: @screen-xl) {
        min-width: 320px;
      }

      @media (max-width: @screen-lg) {
        min-width: 260px;
      }

      @media (max-width: @screen-md) {
        min-width: 240px;
      }

      @media (max-width: @screen-sm) {
        min-width: 160px;
      }
    }

    .@{countdown-prefix-cls} input {
      min-width: unset;
    }

    .ant-divider-inner-text {
      color: @text-color-secondary;
      font-size: 12px;
    }
  }

  @keyframes myfirst2 {
    from {
      transform: rotate(0deg);
    }

    to {
      transform: rotate(359deg);
    }
  }
</style>
