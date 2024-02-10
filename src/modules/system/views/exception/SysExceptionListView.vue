<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
    <ExceptionDetailModal @register="registerModal" />
  </div>
</template>

<script lang="ts" setup>
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import { useModal } from '@/components/Modal';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { getSearchFormSchemas, getTableColumns } from './SysExceptionListView.config';
  import { listApi } from './SysExceptionListView.api';
  import ExceptionDetailModal from './components/ExceptionDetailModal.vue';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('system.views.exception.title.showStackTrace'),
        onClick: () => {
          openModal(true, row.id);
        },
      },
    ];
  };

  const [registerModal, { openModal }] = useModal();

  const [registerTable] = useSmartTable({
    id: 'smart-system-tool-exception',
    customConfig: { storage: true },
    border: true,
    showOverflow: 'tooltip',
    height: 'auto',
    stripe: true,
    pagerConfig: true,
    useSearchForm: true,
    searchFormConfig: {
      layout: 'inline',
      searchWithSymbol: true,
      schemas: getSearchFormSchemas(t),
      colon: true,
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    toolbarConfig: {
      refresh: true,
      zoom: true,
      column: { columnOrder: true },
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'createTime',
        order: 'desc',
      },
    },
    columns: getTableColumns(),
    columnConfig: {
      resizable: true,
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) =>
          listApi({
            sortName: 'createTime',
            sortOrder: 'desc',
            ...ajaxParameter,
          }),
      },
    },
  });
</script>

<style scoped></style>
