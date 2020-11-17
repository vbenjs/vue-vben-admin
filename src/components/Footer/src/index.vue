<template>
  <div class="app-footer" :style="{ width: getWidth }">
    <div class="app-footer__left">
      <slot name="left" />
    </div>
    <div class="app-footer__right">
      <slot name="right" />
    </div>
  </div>
</template>
<script lang="ts">
  import { defineComponent, computed, unref } from 'vue';
  import { SIDE_BAR_MINI_WIDTH, SIDE_BAR_SHOW_TIT_MINI_WIDTH } from '/@/enums/appEnum';
  import { appStore } from '/@/store/modules/app';
  import { menuStore } from '/@/store/modules/menu';
  export default defineComponent({
    name: 'AppFooter',
    setup() {
      const getMiniWidth = computed(() => {
        const {
          menuSetting: { collapsedShowTitle },
        } = appStore.getProjectConfig;
        return collapsedShowTitle ? SIDE_BAR_SHOW_TIT_MINI_WIDTH : SIDE_BAR_MINI_WIDTH;
      });

      const getWidth = computed(() => {
        const { getCollapsedState, getMenuWidthState } = menuStore;
        const width = getCollapsedState ? unref(getMiniWidth) : getMenuWidthState;
        return `calc(100% - ${width}px)`;
      });

      return { getWidth };
    },
  });
</script>
<style lang="less" scoped>
  .app-footer {
    position: fixed;
    right: 0;
    bottom: 0;
    z-index: 99;
    display: flex;
    width: 100%;
    align-items: center;
    padding: 0 24px;
    line-height: 44px;
    background: #fff;
    border-top: 1px solid #f0f0f0;
    box-shadow: 0 -6px 16px -8px rgba(0, 0, 0, 0.08), 0 -9px 28px 0 rgba(0, 0, 0, 0.05),
      0 -12px 48px 16px rgba(0, 0, 0, 0.03);
    transition: width 0.3s;

    &__left {
      flex: 1 1;
    }
  }
</style>
