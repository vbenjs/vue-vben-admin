<script setup lang="ts">
  import { pageNotFoundSvg } from '@vben/assets';
  import { useCssModule } from 'vue';
  import { useRouter } from 'vue-router';

  defineOptions({
    name: 'PageNotFound',
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

  const $style = useCssModule();
  const { push } = useRouter();

  // 返回首页
  function back() {
    push(props.homePath);
  }
</script>

<template>
  <div :class="$style['not-found']">
    <img :src="pageNotFoundSvg" />
    <p> {{ title }} </p>
    <a href="javascript:void" @click="back">返回主页</a>
  </div>
</template>

<style module scoped lang="scss">
  .not-found {
    display: flex;
    position: relative;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;

    img {
      width: 25%;
    }

    p {
      margin: 20px 0;
      color: #00000073;
      font-size: 16px;
      line-height: 1.6;
      text-align: center;
    }

    a {
      display: inline-block;
      padding: 10px 20px;
      transition: background-color 0.3s ease;
      border: none;
      border-radius: 2px;
      background-color: #7c7c7c;
      color: #fff;
      font-size: 14px;
      font-weight: bold;
      text-decoration: none;
      text-transform: uppercase;
      cursor: pointer;

      &:hover {
        background-color: #404040;
      }
    }
  }
</style>
