<template>
  <div :class="[prefixCls]">
    <PageLayout />
  </div>
</template>

<script setup lang="ts">
  import PageLayout from '/@/layouts/page/index.vue';
  import { useDesign } from '/@/hooks/web/useDesign';

  const { prefixCls } = useDesign('layout-content');
</script>

<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;

    &-loading {
      z-index: @page-loading-z-index;
      background-color: @primary-color;
    }
  }
</style>
