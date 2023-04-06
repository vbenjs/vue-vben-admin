<template>
  <div :class="`${prefixCls}`">
    <AppSearchKeyItem :class="`${prefixCls}-item`" icon="ant-design:enter-outlined" />
    <span>{{ t('component.app.toSearch') }}</span>
    <AppSearchKeyItem :class="`${prefixCls}-item`" icon="ion:arrow-up-outline" />
    <AppSearchKeyItem :class="`${prefixCls}-item`" icon="ion:arrow-down-outline" />
    <span>{{ t('component.app.toNavigate') }}</span>
    <AppSearchKeyItem :class="`${prefixCls}-item`" icon="mdi:keyboard-esc" />
    <span>{{ t('common.closeText') }}</span>
  </div>
</template>

<script lang="ts" setup>
  import AppSearchKeyItem from './AppSearchKeyItem.vue';
  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';

  const { prefixCls } = useDesign('app-search-footer');
  const { t } = useI18n();
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-search-footer';

  .@{prefix-cls} {
    display: flex;
    position: relative;
    flex-shrink: 0;
    align-items: center;
    height: 44px;
    padding: 0 16px;
    border-top: 1px solid @border-color-base;
    border-radius: 0 0 16px 16px;
    background-color: @component-background;
    color: #666;
    font-size: 12px;

    &-item {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 20px;
      height: 18px;
      margin-right: 0.4em;
      padding-bottom: 2px;
      border-radius: 2px;
      background-color: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
      box-shadow: inset 0 -2px 0 0 #cdcde6, inset 0 0 1px 1px #fff,
        0 1px 2px 1px rgb(30 35 90 / 40%);

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(6) {
        margin-left: 14px;
      }
    }
  }
</style>
