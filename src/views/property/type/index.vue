<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          type="primary"
          preIcon="gg:qr"
          @click="handleInvite"
          v-auth="`${AUTH_KEY}_invite`"
        >
          邀请供应商
        </a-button>
      </template>
    </BasicTable>

    <InvitDrawer @register="registerInvitDrawer" />
  </div>
</template>
<script lang="tsx" setup>
  import { getFormConfig, getColumns, AUTH_KEY } from './data';
  import { StoreResult } from '@/api/model/storeModel';
  import { deleteStore, getStore, getStoreById } from '@/api/store';
  import { useDrawer } from '@/components/Drawer';
  import { QRCode } from 'ant-design-vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';

  defineOptions({ name: 'SupplierList' });

  // const InvitDrawer = createAsyncComponent(() => import('./Drawer/InvitQRDrawer.vue'));

  const [registerInvitDrawer, { openDrawer: openInvitDrawer }] = useDrawer();
  const { createInfoModal } = useMessage();

  const [registerTable, { reload }] = useTable({
    api: (where) => getStore(where, true),
    columns: getColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getFormConfig(),
    showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    actionColumn: {
      width: 120,
      title: '操作',
      dataIndex: 'action',
      auth: [`${AUTH_KEY}_edit`, `${AUTH_KEY}_del`],
      customRender: ({ record }) => {
        return createActions(record as StoreResult);
      },
    },
  });

  const createActions = (record: StoreResult) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'clarity:note-edit-line',
            tooltip: '编辑',
            auth: `${AUTH_KEY}_edit`,
            //onClick: handleEdit.bind(null, record.id),
          },
          {
            icon: 'ant-design:delete-outlined',
            tooltip: '删除',
            color: 'error',
            auth: `${AUTH_KEY}_del`,
            popConfirm: {
              title: '是否确认删除？',
              placement: 'left',
              confirm: handleDelete.bind(null, record.id),
            },
          },
        ]}
      />
    );
  };

  const handleInvite = () => {
    createInfoModal({
      title: '邀请供应商',
      centered: true,
      // closable: true,
      maskClosable: true,
      footer: null,
      width: 270,
      content: () => (
        <div class="my-2">
          <QRCode value="https://www.baidu.com" />
        </div>
      ),
    });
    // openInvitDrawer(true, {
    //   actionKey: 'create',
    // });
  };

  const handleDelete = async (id: number) => {
    await deleteStore(id);
    reload();
  };
</script>
