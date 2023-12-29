<template>
  <a-alert type="info" showIcon :class="[prefixCls]">
    <template #message>
      <span v-if="props.count > 0">
        {{ t('component.table.selectionBarTips', { count: props.count }) }}
      </span>
      <span v-else>
        {{ t('component.table.selectionBarEmpty') }}
      </span>
      <a-button type="link" @click="clearSelectedRowKeys" size="small" v-show="props.count > 0">
        {{ t('component.table.selectionBarClear') }}
      </a-button>
    </template>
  </a-alert>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useDesign } from '@/hooks/web/useDesign';

  import type { TableActionType } from '../types/table';
  import { Alert as AAlert } from 'ant-design-vue';

  const { t } = useI18n();

  const { prefixCls } = useDesign('table-select-bar');

  defineOptions({
    name: 'TableSelectBar',
  });

  const props = withDefaults(
    defineProps<{
      count?: number;
      //
      clearSelectedRowKeys: TableActionType['clearSelectedRowKeys'];
    }>(),
    {
      count: () => 0,
    },
  );
</script>

<style lang="less" scoped>
  @prefix-cls: ~'@{namespace}-table-select-bar';

  .@{prefix-cls} {
    flex-grow: 1;
    padding: 2px 8px;

    :deep(.ant-btn-link) {
      height: 20px;
      line-height: 20px;
    }
  }
</style>
