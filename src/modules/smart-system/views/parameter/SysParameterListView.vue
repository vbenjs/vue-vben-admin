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
    Permissions,
  } from './SysParameterListView.config';
  import { batchSaveUpdateApi, deleteApi, getByIdApi, listApi } from './SysParameterListView.api';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const getActions = (row): ActionItem[] => {
    const { buildIn } = row;
    const result: ActionItem[] = [
      {
        label: t('common.button.edit'),
        auth: buildIn ? Permissions.updateBuildIn : Permissions.update,
        onClick: () => editByRowModal(row),
      },
    ];
    if (!buildIn) {
      result.push({
        label: t('common.button.delete'),
        auth: Permissions.delete,
        danger: true,
        onClick: () => deleteByRow(row),
      });
    }
    return result;
  };

  const [registerTable, { editByRowModal, deleteByRow }] = useSmartTable({
    id: 'smart-system-sysParameter',
    columns: getTableColumns(),
    height: 'auto',
    pagerConfig: true,
    border: true,
    stripe: true,
    useSearchForm: true,
    columnConfig: {
      resizable: true,
    },
    customConfig: { storage: true },
    rowConfig: {
      keyField: 'id',
      isHover: true,
    },
    sortConfig: {
      remote: true,
    },
    showOverflow: 'tooltip',
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
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
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
    exportConfig: {},
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: { columnOrder: true },
      sizeSetting: true,
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
