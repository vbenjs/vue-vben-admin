<script setup lang="ts">
  import { loginBgSvg, loginSloganSvg, logoImage } from '@vben/assets';
  import { useNamespace } from '@vben/hooks';
  import { computed } from 'vue';

  defineOptions({
    name: 'LoginPage',
  });

  interface Props {
    /**
     * @description 应用名
     */
    appName: string;
    /**
     * @description 介绍标题
     */
    slogan: string;
    /**
     * @description 描述
     */
    description: string;
    /**
     * @description logo图片
     */
    logo: string;
  }

  withDefaults(defineProps<Props>(), {
    appName: 'Vben Admin',
    slogan: '开箱即用的中后台管理系统',
    description: '输入您的个人详细信息开始使用！',
    logo: logoImage,
  });

  const { b, e } = useNamespace('login');

  // TODO: 黑暗模式
  const loginBackagroundImage = computed(() => {
    return `url(${loginBgSvg})`;
  });
</script>

<template>
  <div :class="b()">
    <div :class="[e('header'), '-enter-x']">
      <img :src="logo" :class="e('logo')" />
      <div :class="e('appname')">
        {{ appName }}
      </div>
    </div>

    <div :class="e('slogan')">
      <div :class="e('content')">
        <img :alt="appName" :src="loginSloganSvg" class="-enter-x w-2/5" />
        <div :class="[e('title'), '-enter-x']">
          {{ slogan }}
        </div>
        <div :class="[e('desc'), '-enter-x']">
          {{ description }}
        </div>
      </div>
    </div>
    <div :class="e('form')"> 2</div>
  </div>
</template>

<style lang="scss" module scoped>
  @include b('login') {
    display: flex;
    width: 100%;
    height: 100%;
    min-height: 100%;
    background: #fff;

    @include e('header') {
      position: absolute;
      display: flex;
      align-items: center;
      width: 100%;
      height: 80px;
      padding: 0 100px;
      text-align: left;
      cursor: pointer;
    }

    @include e('logo') {
      width: 32px;
      height: 32px;
      margin-right: 8px;
    }

    @include e('appname') {
      margin-left: 8px;
      font-size: 30px;
      color: #fff;
    }

    @include e('slogan') {
      flex: 1;
      height: 100%;
      background-image: v-bind('loginBackagroundImage');
      background-repeat: no-repeat;
      background-position: 100%;
      background-size: auto 100%;
    }

    @include e('content') {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      height: 100%;
    }

    @include e('title') {
      margin: 20px 0 0;
      font-size: 32px;
      color: #fff;
    }

    @include e('desc') {
      margin-top: 16px;
      font-size: 14px;
      color: #fff;
    }

    @include e('form') {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: center;
    }
  }
</style>
