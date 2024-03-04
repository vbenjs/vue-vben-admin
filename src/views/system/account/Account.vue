<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="ant-design:plus-outlined"
          @click="handleCreate"
          v-auth="'accountManager_accountCreate'"
        >
          新建账户
        </a-button>
      </template>
    </BasicTable>

    <AccountDrawer @register="registerDrawer" @success="handleSuccess" />
    <LoginRecord @register="registerDrawer1" />
    <StoreAuth @register="registerDrawer2" />
  </div>
</template>
<script lang="tsx" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';

  import { getFormConfig, getColumn } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { deleteAccount, getAccount, getAccountById, resetPassword } from '@/api/system/account';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createPassword } from '@/utils/password';
  import { copyText } from '@/utils/copyTextToClipboard';
  import { Icon } from '@/components/Icon';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: 'Account' });

  const AccountDrawer = createAsyncComponent(() => import('./drawer/AccountDrawer.vue'));
  const LoginRecord = createAsyncComponent(() => import('./drawer/LoginRecord.vue'));
  const StoreAuth = createAsyncComponent(() => import('./drawer/StoreAuth.vue'));

  const { createSuccessModal } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerDrawer1, { openDrawer: openLoginRecord }] = useDrawer();
  const [registerDrawer2, { openDrawer: openStoreAuth }] = useDrawer();

  const [registerTable, { reload, updateTableDataRecord }] = useTable({
    title: '账号列表',
    api: (where) => getAccount(where, true),
    columns: getColumn(),
    rowKey: 'id',
    actionColumn: {
      width: 200,
      title: '操作',
      dataIndex: 'action',
      auth: [
        'accountManager_edit',
        'accountManager_netdisk',
        'accountManager_login-record',
        'accountManager_reset-pwd',
        'accountManager_del',
        'UserStore',
      ],
      customRender: ({ record }) => {
        return createActions(record as Account);
      },
    },
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    tableSetting: { fullScreen: true },
    loading: true,
    showIndexColumn: false,
  });

  const handleCreate = () => {
    openDrawer(true, {
      actionKey: 'create',
    });
  };

  function handleSuccess({ action, values }) {
    if (action == 'edit') {
      updateTableDataRecord(values.id, values);
    } else {
      reload();
    }
  }

  const createActions = (record: Account) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '账号编辑',
            auth: 'accountManager_edit',
            onClick: async () => {
              const account = await getAccountById(record.id);
              openDrawer(true, {
                record: account,
                actionKey: 'edit',
              });
            },
            ifShow: record.sysDefault !== 'Y',
          },
          {
            icon: 'ant-design:file-search-outlined',
            tooltip: '登录记录',
            auth: 'accountManager_login-record',
            onClick: () =>
              openLoginRecord(true, {
                record,
              }),
          },
          {
            icon: 'bx:map',
            tooltip: '地点权限',
            auth: 'UserStore',
            onClick: () =>
              openStoreAuth(true, {
                record,
              }),
          },
          {
            icon: 'carbon:password',
            color: 'warning',
            tooltip: '重置密码',
            auth: 'accountManager_reset-pwd',
            popConfirm: {
              title: '是否确认要重置密码？',
              placement: 'left',
              confirm: async () => {
                const password = createPassword();
                resetPassword(record.id, password).then(() => {
                  createSuccessModal({
                    title: '重置成功！',
                    content: `密码已经重置为:${password},请保存！`,
                    onOk: () => {
                      copyText(password);
                      return Promise.resolve();
                    },
                    okText: () => (
                      <div>
                        <Icon style="margin-right:4px" icon="ant-design:copy-outlined" />
                        复制密码
                      </div>
                    ),
                  });
                });
              },
            },
            ifShow: record.sysDefault !== 'Y',
          },
          {
            icon: 'ant-design:delete-outlined',
            color: 'error',
            auth: 'accountManager_del',
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: () => deleteAccount(record.id).then(() => reload()),
            },
            ifShow: record.sysDefault !== 'Y',
          },
        ]}
      />
    );
  };
</script>
