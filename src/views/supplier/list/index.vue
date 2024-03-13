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
  import { getFormConfig, AUTH_KEY, TableResult } from './data';
  import { useDrawer } from '@/components/Drawer';
  import { QRCode } from 'ant-design-vue';
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { useMessage } from '@/hooks/web/useMessage';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { getCompanyColumns } from '@/views/common/Columns';
  import { deleteCompany, getCompany } from '@/api/company/company';

  defineOptions({ name: AUTH_KEY });

  // const InvitDrawer = createAsyncComponent(() => import('./Drawer/InvitQRDrawer.vue'));

  const [registerInvitDrawer, { openDrawer: openInvitDrawer }] = useDrawer();
  const { createInfoModal } = useMessage();

  const [registerTable, { reload }] = useTable({
    api: (where) => getCompany(where, true),
    columns: getCompanyColumns({ companyType: 'SUPPLIER' }),
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
        return createActions(record as TableResult);
      },
    },
  });

  const createActions = (record: TableResult) => {
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
    await deleteCompany([id]);
    reload();
  };
</script>
