<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import {
    ActionItem,
    SmartTable,
    SmartVxeTableAction,
    useSmartTable,
  } from '@/components/SmartTable';

  import {
    getFormSchemas,
    getSearchFormSchemas,
    getTableColumns,
    Permission,
  } from './SysTenantListView.config';
  import { batchSaveUpdateApi, deleteApi, getByIdApi, listApi } from './SysTenantListView.api';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        auth: Permission.update,
        onClick: () => editByRowModal(row),
      },
      {
        label: t('common.button.delete'),
        auth: Permission.delete,
        danger: true,
        onClick: () => deleteByRow(row),
      },
    ];
  };

  const [registerTable, { editByRowModal, deleteByRow }] = useSmartTable({
    id: 'system-tenant-list',
    customConfig: { storage: true },
    columns: getTableColumns(),
    height: 'auto',
    pagerConfig: true,
    useSearchForm: true,
    border: true,
    stripe: true,
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    columnConfig: {
      resizable: true,
    },
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      colon: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      modalConfig: {
        width: 800,
      },
      formConfig: {
        colon: true,
        schemas: getFormSchemas(t),
        baseColProps: { span: 12 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    sortConfig: {
      remote: true,
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
      },
    },
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: { columnOrder: true },
      buttons: [
        {
          code: 'ModalAdd',
        },
        {
          code: 'delete',
        },
      ],
    },
  });
</script>
