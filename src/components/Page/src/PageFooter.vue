<template>
  <div class="app-footer" :style="{ width: getCalcContentWidth }">
    <div class="app-footer__left">
      <slot name="left" />
    </div>
    <div class="app-footer__right">
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent } from 'vue';

  import { useMenuSetting } from '/@/hooks/setting/useMenuSetting';

  export default defineComponent({
    name: 'PageFooter',
    setup() {
      const { getCalcContentWidth } = useMenuSetting();
      return { getCalcContentWidth };
    },
  });
</script>
<style lang="less" scoped>
  @import (reference) '../../../design/index.less';

  .app-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: @page-footer-z-index;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 24px;
    line-height: 44px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    box-shadow: 0 -6px 16px -8px rgba(0, 0, 0, 0.08), 0 -9px 28px 0 rgba(0, 0, 0, 0.05),
      0 -12px 48px 16px rgba(0, 0, 0, 0.03);
    transition: width 0.4s;

    &__left {
      flex: 1 1;
    }
  }
</style>
