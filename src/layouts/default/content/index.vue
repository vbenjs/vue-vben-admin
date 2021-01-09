<template>
  <div :class="[prefixCls, getLayoutContentMode]">
    <transition name="fade">
      <Loading
        v-if="getOpenPageLoading"
        :loading="getPageLoading"
        background="rgba(240, 242, 245, 0.6)"
        absolute
        :class="`${prefixCls}-loading`"
      />
    </transition>
    <PageLayout />
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useRootSetting } from '/@/hooks/setting/useRootSetting';
  import { useTransitionSetting } from '/@/hooks/setting/useTransitionSetting';
  import PageLayout from '/@/layouts/page/index.vue';
  import { useContentViewHeight } from './useContentViewHeight';
  import { Loading } from '/@/components/Loading';

  export default defineComponent({
    name: 'LayoutContent',
    components: { PageLayout, Loading },
    setup() {
      const { prefixCls } = useDesign('layout-content');
      const { getOpenPageLoading } = useTransitionSetting();
      const { getLayoutContentMode, getPageLoading } = useRootSetting();

      useContentViewHeight();
      return {
        prefixCls,
        getOpenPageLoading,
        getLayoutContentMode,
        getPageLoading,
      };
    },
  });
</script>
<style lang="less">
  @prefix-cls: ~'@{namespace}-layout-content';

  .@{prefix-cls} {
    position: relative;
    flex: 1 1 auto;
    min-height: 0;

    &.fixed {
      width: 1200px;
      margin: 0 auto;
    }

    &-loading {
      position: absolute;
      top: 200px;
      z-index: @page-loading-z-index;
    }
  }
</style>
