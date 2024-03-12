<template>
  <div class="full-height page-container">
    <SmartTable @register="registerTable" :size="getTableSize">
      <template #table-operation="{ row }">
        <SmartVxeTableAction :actions="getTableActions(row)" />
      </template>
    </SmartTable>
    <SmartUserSelectModal
      @register="registerSetUserModal"
      width="1500px"
      showSelect
      @selected="handleUserSelected"
      :select-values="selectUserList"
      :title="$t('system.views.userGroup.button.setUser')"
    />
  </div>
</template>

<script lang="ts" setup>
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { useI18n } from '@/hooks/web/useI18n';
  import { SmartUserSelectModal } from '@/components/Form';

  import {
    getAddEditFormSchemas,
    getSearchSchemas,
    getTableColumns,
  } from './UserGroupListView.config';
  import {
    listApi,
    deleteApi,
    batchSaveUpdateApi,
    getByIdApi,
    setUseYnApi,
  } from './UserGroupListView.api';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import { useSetUser } from './hooks/useSetUser';

  const { getTableSize } = useSizeSetting();
  const { t } = useI18n();
  const permissions = SystemPermissions.userGroup;
  const { registerSetUserModal, handleShowSetUser, handleUserSelected, selectUserList } =
    useSetUser(t);

  const getTableActions = (row: any): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        preIcon: 'ant-design:edit-out-lined',
        auth: permissions.update,
        onClick: () => editByRowModal(row),
      },
      {
        label: t('system.views.userGroup.button.setUser'),
        preIcon: 'ant-design:user-add-outlined',
        auth: permissions.setUser,
        onClick: () => {
          handleShowSetUser(row);
        },
      },
    ];
  };

  const [registerTable, { editByRowModal }] = useSmartTable({
    columns: getTableColumns(),
    height: 'auto',
    stripe: true,
    highlightHoverRow: true,
    pagerConfig: true,
    useSearchForm: true,
    border: true,
    sortConfig: {
      remote: true,
      defaultSort: {
        field: 'seq',
        order: 'asc',
      },
    },
    searchFormConfig: {
      layout: 'inline',
      schemas: getSearchSchemas(t),
      autoSubmitOnEnter: true,
      colon: true,
      searchWithSymbol: true,
      actionColOptions: {
        span: undefined,
      },
      compact: true,
    },
    addEditConfig: {
      formConfig: {
        colon: true,
        schemas: getAddEditFormSchemas(t),
        labelCol: {
          span: 5,
        },
        wrapperCol: {
          span: 18,
        },
        baseColProps: {
          span: 24,
        },
      },
    },
    proxyConfig: {
      ajax: {
        query: ({ ajaxParameter }) => listApi(ajaxParameter),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (data) => getByIdApi(data),
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
        useYn: setUseYnApi,
      },
    },
    columnConfig: {
      resizable: true,
    },
    toolbarConfig: {
      refresh: true,
      custom: true,
      zoom: true,
      buttons: [
        {
          code: 'ModalAdd',
          auth: permissions.add,
        },
        {
          code: 'delete',
          auth: permissions.delete,
        },
        {
          code: 'useYnTrue',
          auth: permissions.useYn,
        },
        {
          code: 'useYnFalse',
          auth: permissions.useYn,
        },
      ],
    },
  });
</script>

<style scoped></style>
