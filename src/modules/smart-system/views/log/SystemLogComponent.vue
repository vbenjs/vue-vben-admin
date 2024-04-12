<template>
  <div class="full-height page-container" :class="getClass">
    <SmartTable @register="registerTable" v-bind="$attrs" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
      <template #table-statusCode="{ row }">
        <a-tag :color="row.statusCode >= 200 && row.statusCode < 300 ? '#2db7f5' : '#f50'">
          {{ row.statusCode }}
        </a-tag>
      </template>
      <template #table-useTime="{ row }">
        <a-tag v-if="row.useTime !== null" :color="getUseTimeTagColor(row.useTime)">
          {{ row.useTime }}
        </a-tag>
      </template>
      <template #search-tenantId="{ model, field }">
        <SysTenantSelect style="width: 100px" allowClear v-model:value="model[field]" />
      </template>
    </SmartTable>
    <LogDetailModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  /**
   * 日志组件
   */
  import type { LoginIdent } from './SystemLogComponent.config';

  import { computed } from 'vue';
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useModal } from '@/components/Modal';

  import { listApi } from './SystemLogComponent.api';
  import { getTableColumns, getSearchFormSchemas } from './SystemLogComponent.config';
  import LogDetailModal from './components/LogDetailModal.vue';
  import { SysTenantSelect } from '@/modules/smart-system/components';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';

  const props = defineProps({
    ident: {
      type: String as PropType<LoginIdent>,
      required: true,
    },
  });

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();
  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const [registerModal, { openModal }] = useModal();

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('common.title.details'),
        preIcon: 'ant-design:bars-outlined',
        onClick: () => {
          openModal(true, row.logId);
        },
      },
    ];
  };

  const getClass = computed(() => {
    if (props.ident === 'INTERFACE_LOG') {
      return ['two-search'];
    }
    return [];
  });

  /**
   * 获取使用时间tag颜色
   * @param useTime 时长
   */
  const getUseTimeTagColor = (useTime: number) => {
    if (useTime <= 300) {
      return 'blue';
    }
    if (useTime <= 500) {
      return 'green';
    }
    if (useTime <= 1000) {
      return 'orange';
    }
    return 'pink';
  };

  const [registerTable] = useSmartTable({
    customConfig: { storage: true },
    columns: getTableColumns(props.ident),
    height: 'auto',
    border: true,
    rowConfig: {
      isHover: true,
    },
    stripe: true,
    showOverflow: 'tooltip',
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      compact: true,
      colon: true,
      searchWithSymbol: true,
      schemas: getSearchFormSchemas(t, props.ident, getIsPlatformTenant),
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
    },
    columnConfig: {
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
      column: { columnOrder: true },
      zoom: true,
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => {
          const params = {
            ...ajaxParameter,
            parameter: {
              ...ajaxParameter?.parameter,
              'ident@=': props.ident,
            },
          };
          return listApi(params);
        },
      },
    },
  });
</script>

<style lang="less" scoped>
  .two-search {
    :deep(.smart-table-container) {
      height: calc(100% - 120px) !important;
    }
  }
</style>
