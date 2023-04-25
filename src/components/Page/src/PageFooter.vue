<template>
  <div :class="prefixCls" :style="{ width: getCalcContentWidth }">
    <div :class="`${prefixCls}__left`">
      <slot name="left"></slot>
    </div>
    <slot></slot>
    <div :class="`${prefixCls}__right`">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';
  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';
  import { useDesign } from '/@/hooks/web/useDesign';

  export default defineComponent({
    name: 'PageFooter',
    inheritAttrs: false,
    setup() {
      const { prefixCls } = useDesign('page-footer');
      const { getCalcContentWidth } = useMenuSetting();
      return { prefixCls, getCalcContentWidth };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-page-footer';

  .@{prefix-cls} {
    display: flex;
    position: fixed;
    z-index: @page-footer-z-index;
    right: 0;
    bottom: 0;
    align-items: center;
    width: 100%;
    padding: 0 24px;
    transition: width 0.2s;
    border-top: 1px solid @border-color-base;
    background-color: @component-background;
    box-shadow: 0 -6px 16px -8px rgb(0 0 0 / 8%), 0 -9px 28px 0 rgb(0 0 0 / 5%),
      0 -12px 48px 16px rgb(0 0 0 / 3%);
    line-height: 44px;

    &__left {
      flex: 1 1;
    }
  }
</style>
