<script setup lang="ts">
  import { pageNotFoundSvg } from '@vben/assets';
  import { useNamespace } from '@vben/hooks';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'NotFoundPage',
  });

  interface Props {
    /**
     *  @description 页面提示语
     *  @default 对不起，您访问的页面不存在
     */
    title?: string;
    /**
     *  @description 首页路由地址
     *  @default /
     */
    homePath?: string;
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '对不起，您访问的页面不存在',
    homePath: '/',
  });

  const { b, e } = useNamespace('not-found');

  const { push } = useRouter();

  // 返回首页
  function back() {
    push(props.homePath);
  }
</script>

<template>
  <div :class="[b(), 'enter-y']">
    <img :src="pageNotFoundSvg" :class="e('img')" />
    <p :class="e('title')"> {{ title }} </p>
    <a href="javascript:void" :class="e('button')" @click="back">返回主页</a>
  </div>
</template>

<style module scoped lang="scss">
  @include b('not-found') {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    @include e('img') {
      width: 25%;
    }

    @include e('title') {
      margin: 20px 0;
      font-size: 16px;
      line-height: 1.6;
      color: #00000073;
      text-align: center;
    }

    @include e('button') {
      display: inline-block;
      padding: 10px 20px;
      font-size: 14px;
      font-weight: bold;
      color: #fff;
      text-decoration: none;
      text-transform: uppercase;
      cursor: pointer;
      background-color: #7c7c7c;
      border: none;
      border-radius: 2px;
      transition: background-color 0.3s ease;

      &:hover {
        background-color: #404040;
      }
    }
  }
</style>
