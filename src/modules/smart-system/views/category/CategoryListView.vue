<template>
  <div class="full-height page-container">
    <SmartTable :size="getTableSize" @register="registerTable">
      <template #table-option="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
  </div>
</template>

<script lang="ts" setup>
  import type { ActionItem } from '@/components/SmartTable';

  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartTable, SmartVxeTableAction, useSmartTable } from '@/components/SmartTable';

  import { getFormSchemas, getTableColumns, getSearchFormSchemas } from './CategoryListView.config';
  import { listApi, deleteApi, saveUpdateApi, getByIdApi } from './CategoryListView.api';
  import { storeToRefs } from 'pinia';
  import { useUserStore } from '@/store/modules/user';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const { getIsPlatformTenant } = storeToRefs(useUserStore());

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('system.views.category.button.addChild'),
        onClick: () =>
          showAddModal({
            parentId: row.id,
            parentName: row.categoryName,
            tenantCommonYn: row.tenantCommonYn,
          }),
      },
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
      },
      {
        label: t('common.button.delete'),
        onClick: () => deleteByRow(row),
        danger: true,
      },
    ];
  };

  const [registerTable, { showAddModal, editByRowModal, deleteByRow }] = useSmartTable({
    columns: getTableColumns(),
    border: true,
    height: 'auto',
    useSearchForm: true,
    pagerConfig: true,
    rowConfig: {
      keyField: 'id',
      isCurrent: true,
    },
    treeConfig: {
      parentField: 'parentId',
      lazy: true,
      reserve: true,
      rowField: 'id',
      loadMethod: async ({ row }) => {
        return listApi({}, row.id);
      },
    },
    addEditConfig: {
      formConfig: {
        schemas: getFormSchemas(t, getIsPlatformTenant),
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    toolbarConfig: {
      refresh: true,
      buttons: [
        {
          code: 'ModalAdd',
          props: {
            onClick: () => showAddModal({ parentId: 0, parentName: '根节点' }),
          },
        },
      ],
    },
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        save: ({ body: { insertRecords, updateRecords } }) =>
          saveUpdateApi([...insertRecords, ...updateRecords][0]),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords.map((item) => item.id)),
        getById: (params) => getByIdApi(params.id),
      },
    },
    searchFormConfig: {
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      compact: true,
      actionColOptions: {
        span: undefined,
      },
      colon: true,
      layout: 'inline',
    },
  });
</script>

<style scoped></style>
