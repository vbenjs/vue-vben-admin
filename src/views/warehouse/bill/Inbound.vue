<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="handleShowProduct" v-auth="'inboundManager_showProduct'">
          查看明细
        </a-button>
        <ApiButton :api="handleExportPackage" v-auth="'inboundManager_exportPackage'">
          导出盒明细
        </ApiButton>
        <ApiButton :api="handleExportBox" v-auth="'inboundManager_exportBox'">
          导出箱明细
        </ApiButton>

        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'inboundManager_print'"
        >
          打印
        </a-button>

        <a-button @click="handleUpdateNote" v-auth="'inboundManager_note'"> 更新备注 </a-button>
      </template>
    </BasicTable>

    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['IN', 'IN_PACKAGE', 'IN_BOX', 'IN_PALLET']"
      isBill
      storageKey="IN"
    />
    <RemindDrawer @register="registerRemindDrawer" @success="reload" />
    <BatchRemindDrawer
      @register="registerBatchRemindDrawer"
      :updateApi="updateBillNote4Batch"
      field="note"
      batch
      help="这将同步替换单据下全部产品的备注4"
      @success="reload"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { HashingFactory } from '@/utils/cipher';
  import { getBillColumns, getBillFormConfig, useExcelExportConfig } from '../TableColumns';
  import {
    cancelIn,
    exportBox,
    exportPackage,
    getBill,
    updateBillNote4Batch,
  } from '@/api/warehouse/bill';
  import { HxBill } from '@/ApiModel/warehouse/bill';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'Inbound' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));
  const RemindDrawer = createAsyncComponent(() => import('./Popup/UpdateDrawer.vue'));
  const BatchRemindDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/RemindDrawer.vue'),
  );

  const go = useGo();
  const { createMessage: msg } = useMessage();
  const { status, source, allMatch } = useExcelExportConfig();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerRemindDrawer, { openDrawer: openRemindDrawer }] = useDrawer();
  const [registerBatchRemindDrawer, { openDrawer: openBatchRemindDrawer }] = useDrawer();

  const [registerTable, { getSelectRows, reload }] = useTable({
    api: getBill,
    searchInfo: {
      type: 'IN',
      isTable: true,
    },
    columns: getBillColumns('IN'),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getBillFormConfig('IN'),
    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: { export: true },
    exportConfig: { status, source, allMatch },
    rowSelection: {
      type: 'checkbox',
    },
    defSort: {
      columnKey: 'billDate',
      order: 'descend',
    },
    actionColumn: {
      width: 100,
      title: '操作',
      dataIndex: 'action',
      auth: ['inboundManager_detail', 'inboundManager_redo', 'inboundManager_updateInfo'],
      customRender: ({ record }) => {
        return createActions(record);
      },
    },
    clearSelectOnPageChange: true,
  });

  const createActions = (record: HxBill) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'majesticons:redo-line',
            tooltip: '撤回',
            auth: 'inboundManager_redo',
            ifShow: record.status === 'WAIT_RECEIVE',
            popConfirm: {
              title: '确定撤回吗？',
              confirm: async () => {
                await cancelIn(record.id);
                msg.success('撤回成功');
                reload();
              },
            },
          },
          {
            icon: 'fluent:note-pin-20-regular',
            tooltip: '更新单据信息',
            auth: 'inboundManager_updateInfo',
            onClick: () => {
              openRemindDrawer(true, {
                id: record.id,
                note: record.note,
                outCode: record.outCode,
              });
            },
          },
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '入库明细',
            auth: 'inboundManager_detail',
            onClick: () => {
              const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
              go({
                path: '/warehouse/billDetail/' + md5,
                query: { id: record.id, billCode: record.billCode },
              });
            },
          },
        ]}
      />
    );
  };

  const handleSelectPrinter = () => {
    const rows = getSelectRows();
    if (rows.length === 0) {
      msg.warning('请选择需要打印的数据');
      return;
    }
    openPrintDrawer(true, {
      rows: rows,
    });
  };

  const handleExportPackage = async () => {
    const rows = getSelectRows() as HxBill[];
    if (rows.length === 0) {
      msg.warning('请选择需要导出的数据');
      return;
    }
    await exportPackage(rows.map((o) => o.billCode));
    msg.success('导出成功');
  };

  const handleExportBox = async () => {
    const rows = getSelectRows() as HxBill[];
    if (rows.length === 0) {
      msg.warning('请选择需要导出的数据');
      return;
    }
    await exportBox(rows.map((o) => o.billCode));
    msg.success('导出成功');
  };

  const handleShowProduct = () => {
    const rows = getSelectRows() as HxBill[];
    if (rows.length === 0) {
      msg.warning('请选择需要查看的数据');
      return;
    }
    const codes = rows.map((o) => o.billCode).join(',');
    const ids = rows.map((o) => o.id).join(',');
    const md5 = HashingFactory.createMD5Hashing().hash(codes);
    go({
      path: '/warehouse/productDetail/' + md5,
      query: { codes, ids, billType: 'IN', title: '入库' },
    });
  };

  const handleUpdateNote = () => {
    const rows = getSelectRows() as HxBill[];
    if (rows.length === 0) {
      msg.warning('请选择需要更新的数据');
      return;
    }
    const ids = rows.map((o) => o.id).join(',');
    openBatchRemindDrawer(true, {
      id: ids,
      note: '',
    });
  };
</script>
