<template>
  <PageWrapper title="动画组件示例">
    <div class="flex">
      <Select
        :options="options"
        v-model:value="value"
        placeholder="选择动画"
        :style="{ width: '150px' }"
      />
      <a-button type="primary" class="ml-4" @click="start"> start </a-button>
    </div>
    <component :is="TransitionItem[value]">
      <div class="box" v-show="show"></div>
    </component>
  </PageWrapper>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { Select } from 'ant-design-vue';
  import { PageWrapper } from '@/components/Page';
  import {
    FadeTransition,
    ScaleTransition,
    SlideYTransition,
    ScrollYTransition,
    SlideYReverseTransition,
    ScrollYReverseTransition,
    SlideXTransition,
    ScrollXTransition,
    SlideXReverseTransition,
    ScrollXReverseTransition,
    ScaleRotateTransition,
    ExpandXTransition,
    ExpandTransition,
  } from '@/components/Transition';

  const TransitionItem = {
    FadeTransition,
    ScaleTransition,
    SlideYTransition,
    ScrollYTransition,
    SlideYReverseTransition,
    ScrollYReverseTransition,
    SlideXTransition,
    ScrollXTransition,
    SlideXReverseTransition,
    ScrollXReverseTransition,
    ScaleRotateTransition,
    ExpandXTransition,
    ExpandTransition,
  };

  const options = Object.keys(TransitionItem).map((item) => {
    const label = item.replace('Transition', '');
    return {
      label,
      value: item,
      key: item,
    };
  });

  const value = ref('FadeTransition');
  const show = ref(true);
  function start() {
    show.value = false;
    setTimeout(() => {
      show.value = true;
    }, 300);
  }
</script>
<style lang="less" scoped>
  .box {
    width: 150px;
    height: 150px;
    margin-top: 20px;
    background-color: rgb(126 170 236);
  }
</style>
