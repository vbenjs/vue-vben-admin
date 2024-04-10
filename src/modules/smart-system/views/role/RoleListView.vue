<template>
  <div class="full-height page-container">
    <a-layout class="full-height">
      <a-layout-content class="full-height">
        <SmartTable
          :size="getTableSize"
          @register="registerTable"
          @current-change="handleCurrentChange"
        >
          <template #table-operation="{ row }">
            <SmartVxeTableAction :actions="getTableActions(row)" />
          </template>
        </SmartTable>
      </a-layout-content>
      <a-layout-sider theme="light" class="layout-set-function" width="240px">
        <RoleSetFunction :role-id="currentRow.roleId" />
      </a-layout-sider>
    </a-layout>
    <SmartUserSelectModal
      @register="registerSetUserModal"
      @selected="handleSetUser"
      defaultFullscreen
      showSelect
      :title="$t('system.views.role.button.setRoleUser')"
      :select-values="selectUserList"
    />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue';
  import {
    useSmartTable,
    SmartTable,
    SmartVxeTableAction,
    ActionItem,
  } from '@/components/SmartTable';
  import { useI18n } from '@/hooks/web/useI18n';
  import { useSizeSetting } from '@/hooks/setting/UseSizeSetting';
  import { SmartUserSelectModal } from '@/components/Form';

  import { getAddEditFormSchemas, getSearchSchemas, getTableColumns } from './RoleListView.config';
  import { listApi, batchSaveUpdateApi, deleteApi, getByIdApi } from './RoleListView.api';
  import { SystemPermissions } from '@/modules/smart-system/constants/SystemConstants';
  import RoleSetFunction from './components/RoleSetFunction.vue';
  import { useRoleSetUser } from './hook/useRoleSetUser';
  import { hasPermission } from '@/utils/auth';

  const { t } = useI18n();
  const { getTableSize } = useSizeSetting();

  const permissions = SystemPermissions.role;

  const currentRow = ref<Recordable>({});
  const handleCurrentChange = ({ row }: any) => {
    currentRow.value = row;
  };

  const { registerSetUserModal, handleSetUser, handleShowSetUser, selectUserList } =
    useRoleSetUser(t);

  const getTableActions = (row): ActionItem[] => {
    return [
      {
        label: t('common.button.edit'),
        preIcon: 'ant-design:edit-out-lined',
        auth: permissions.update,
        onClick: () => editByRowModal(row),
      },
      {
        label: t('system.views.role.button.setRoleUser'),
        preIcon: 'ant-design:user-add-outlined',
        auth: permissions.setRoleUser,
        onClick: () => {
          handleShowSetUser(row);
        },
      },
    ];
  };

  const [registerTable, { editByRowModal }] = useSmartTable({
    id: 'sys_role_list',
    columns: getTableColumns(),
    border: true,
    stripe: true,
    height: 'auto',
    pagerConfig: true,
    columnConfig: {
      resizable: true,
    },
    rowConfig: {
      isHover: true,
      isCurrent: true,
    },
    sortConfig: {
      remote: true,
      defaultSort: { field: 'seq', order: 'asc' },
    },
    useSearchForm: true,
    searchFormConfig: {
      compact: true,
      colon: true,
      searchWithSymbol: true,
      schemas: getSearchSchemas(t),
      layout: 'inline',
      actionColOptions: {
        span: undefined,
      },
    },
    proxyConfig: {
      ajax: {
        query: (params) => listApi(params.ajaxParameter),
        delete: ({ body: { removeRecords } }) => deleteApi(removeRecords),
        getById: (model) => getByIdApi(model),
        save: ({ body: { insertRecords, updateRecords } }) =>
          batchSaveUpdateApi([...insertRecords, ...updateRecords]),
      },
    },
    printConfig: {},
    authConfig: {
      authHandler: hasPermission,
    },
    toolbarConfig: {
      zoom: true,
      refresh: true,
      column: true,
      buttons: [
        { code: 'ModalAdd', auth: permissions.add },
        { code: 'delete', auth: permissions.delete },
      ],
    },
    addEditConfig: {
      formConfig: {
        schemas: getAddEditFormSchemas(t),
        colon: true,
        wrapperCol: { span: 18 },
        labelCol: { span: 5 },
        baseColProps: {
          span: 24,
        },
      },
    },
  });
</script>

<style lang="less" scoped>
  .layout-set-function {
    margin-left: 5px;
  }
</style>
