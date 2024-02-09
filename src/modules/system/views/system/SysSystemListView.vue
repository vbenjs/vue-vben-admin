<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-option="{ row }">
        <SmartVxeTableAction :actions="getActions(row)" />
      </template>
    </SmartTable>
    <SmartUserSelectModal
      width="700px"
      title="选择人员"
      @register="registerModal"
      @selected="handleUserSelected"
      :select-values="selectUserList"
    />
  </div>
</template>

<script lang="ts" setup>
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';

  import { SmartUserSelectModal } from '@/components/Form';
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
  } from './SysSystemListView.config';
  import { listApi, deleteApi, getByIdApi, saveUpdateApi } from './SysSystemListView.api';
  import { useSetUser } from './SysSystemListViewHooks';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const { selectUserList, handleUserSelected, registerModal, handleShowSetUser } = useSetUser(t);

  const getActions = (row: Recordable): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        onClick: () => editByRowModal(row),
      },
      {
        label: t('common.button.delete'),
        onClick: () => deleteByRow(row),
        danger: true,
      },
      {
        label: t('system.views.system.button.setUser'),
        onClick: () => {
          handleShowSetUser(row);
        },
      },
    ];
  };

  const [registerTable, { editByRowModal, deleteByRow }] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    useSearchForm: true,
    columnConfig: {
      resizable: true,
    },
    pagerConfig: true,
    addEditConfig: {
      formConfig: {
        schemas: getFormSchemas(t),
        baseColProps: { span: 24 },
        labelCol: { span: 6 },
        wrapperCol: { span: 17 },
      },
    },
    toolbarConfig: {
      refresh: true,
      column: {
        columnOrder: true,
      },
      zoom: true,
      showSearch: true,
      buttons: [
        {
          code: 'ModalAdd',
        },
        {
          code: 'delete',
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
          saveUpdateApi(insertRecords, updateRecords),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (params) => getByIdApi(params.id),
      },
    },
    searchFormConfig: {
      compact: true,
      schemas: getSearchFormSchemas(t),
      searchWithSymbol: true,
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
      // labelCol: {
      //   span: 8,
      // },
      colon: true,
    },
  });
</script>

<style scoped></style>
