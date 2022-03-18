<template>
  <div :class="[prefixCls, getLayoutContentMode]" v-loading="getPageLoading">
    <PageLayout />
  </div>
</template>
<script lang="ts">
import { defineComponent } from 'vue'
import { useDesign } from '@/hooks/web/useDesign'
import { useRootSetting } from '@/hooks/setting/useRootSetting'
import { useContentViewHeight } from './useContentViewHeight'
import PageLayout from '@/layouts/page/index.vue'

export default defineComponent({
  name: 'LayoutContent',
  components: { PageLayout },
  setup() {
    const { prefixCls } = useDesign('layout-content')
    const { getLayoutContentMode, getPageLoading } = useRootSetting()

    useContentViewHeight()
    return {
      prefixCls,
      getLayoutContentMode,
      getPageLoading,
    }
  },
})
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
