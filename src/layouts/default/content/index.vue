<template>
  <div
    :class="[prefixCls, getLayoutContentMode]"
    v-loading="getOpenPageLoading && getPageLoading"
    ref="content"
  >
    <PageLayout />
    <BackTop v-if="getUseOpenBackTop" :target="() => content" :visibilityHeight="100" />
  </div>
</template>
<script lang="ts" setup>
  import { ref } from 'vue';
  import { BackTop } from 'ant-design-vue';

  import PageLayout from '@/layouts/page/index.vue';
  import { useDesign } from '@/hooks/web/useDesign';
  import { useRootSetting } from '@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '@/hooks/setting/useTransitionSetting';
  import { useContentViewHeight } from './useContentViewHeight';

  defineOptions({ name: 'LayoutContent' });

  const { prefixCls } = useDesign('layout-content');
  const { getOpenPageLoading } = useTransitionSetting();
  const { getLayoutContentMode, getPageLoading, getUseOpenBackTop } = useRootSetting();

  useContentViewHeight();

  const content = ref();
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    display: flex;
    position: relative;
    flex-direction: column;
    flex-grow: 1;
    width: 100%;
    height: 0;
    min-height: 0;
    overflow: auto;

    // begin: 下面这块代码 在我的项目打包后在比较宽的屏幕(2K 31 寸)有显示 bug 有偶发性 清缓存首次进入会出现 , 刷新就没了, 这里为什么要指定宽度 ?
    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }
    // end

    &-loading {
      position: absolute;
      z-index: @page-loading-z-index;
      top: 200px;
    }
  }
</style>
