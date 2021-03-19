<template>
  <div :class="`${prefixCls}`">
    <AppSearchKeyItem :class="`${prefixCls}__item`" icon="ant-design:enter-outlined" />
    <span>{{ t('component.app.toSearch') }}</span>

    <AppSearchKeyItem :class="`${prefixCls}__item`" icon="ion:arrow-up-outline" />
    <AppSearchKeyItem :class="`${prefixCls}__item`" icon="ion:arrow-down-outline" />
    <span>{{ t('component.app.toNavigate') }}</span>
    <AppSearchKeyItem :class="`${prefixCls}__item`" icon="mdi:keyboard-esc" />

    <span>{{ t('common.closeText') }}</span>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from 'vue';
  import AppSearchKeyItem from './AppSearchKeyItem.vue';

  import { useDesign } from '/@/hooks/web/useDesign';
  import { useI18n } from '/@/hooks/web/useI18n';
  export default defineComponent({
    name: 'AppSearchFooter',
    components: { AppSearchKeyItem },
    setup() {
      const { prefixCls } = useDesign('app-search-footer');
      const { t } = useI18n();
      return {
        prefixCls,
        t,
      };
    },
  });
</script>
<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-app-search-footer';

  .@{prefix-cls} {
    position: relative;
    display: flex;
    height: 44px;
    padding: 0 16px;
    font-size: 12px;
    color: #666;
    background: rgb(255 255 255);
    border-radius: 0 0 16px 16px;
    box-shadow: 0 -1px 0 0 #e0e3e8, 0 -3px 6px 0 rgba(69, 98, 155, 0.12);
    align-items: center;
    flex-shrink: 0;

    &__item {
      display: flex;
      width: 20px;
      height: 18px;
      padding-bottom: 2px;
      margin-right: 0.4em;
      background: linear-gradient(-225deg, #d5dbe4, #f8f8f8);
      border-radius: 2px;
      box-shadow: inset 0 -2px 0 0 #cdcde6, inset 0 0 1px 1px #fff,
        0 1px 2px 1px rgba(30, 35, 90, 0.4);
      align-items: center;
      justify-content: center;

      &:nth-child(2),
      &:nth-child(3),
      &:nth-child(6) {
        margin-left: 14px;
      }
    }
  }
</style>
