<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
      <template #search-tenantId="{ model, field }">
        <SysTenantSelect allowClear style="width: 120px" v-model:value="model[field]" />
      </template>
      <template #addEdit-tenantId="{ model, field }">
        <SysTenantSelect allowClear v-model:value="model[field]" />
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
    getTableColumns,
    getFormSchemas,
    getSearchFormSchemas,
  } from './SysAuthAccessSecretListView.config';
  import { listApi, deleteApi, getByIdApi, saveUpdateApi } from './SysAuthAccessSecretListView.api';
  import { SysTenantSelect } from '@/modules/smart-system/components';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
      },
    ];
  };

  const [registerTable, { editByRowModal }] = useSmartTable({
    id: 'smart-system-tool-accessSecret',
    customConfig: { storage: true },
    columns: getTableColumns(),
    height: 'auto',
    border: true,
    sortConfig: {
      remote: true,
    },
    rowConfig: {
      isHover: true,
    },
    stripe: true,
    columnConfig: {
      resizable: true,
    },
    showOverflow: 'tooltip',
    pagerConfig: true,
    useSearchForm: true,
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
      formConfig: {
        schemas: getFormSchemas(t),
        colon: true,
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) =>
          saveUpdateApi([...insertRecords, ...updateRecords]),
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
