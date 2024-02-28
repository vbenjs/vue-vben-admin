<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="handleShowProduct" v-auth="'outboundManager_showProduct'">
          查看明细
        </a-button>
        <ApiButton :api="handleExportPackage" v-auth="'outboundManager_exportPackage'">
          导出盒明细
        </ApiButton>
        <ApiButton :api="handleExportBox" v-auth="'outboundManager_exportBox'">
          导出箱明细
        </ApiButton>
        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'outboundManager_print'"
        >
          打印
        </a-button>

        <a-button
          type="primary"
          danger
          ghost
          @click="handleBillBack"
          v-auth="'outboundManager_billBack'"
        >
          退回
        </a-button>

        <a-button @click="handleUpdateNote" v-auth="'outboundManager_note'"> 更新备注 </a-button>
      </template>
    </BasicTable>

    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['OUT', 'OUT_PACKAGE', 'OUT_BOX', 'OUT_PALLET']"
      isBill
      storageKey="OUT"
    />
    <RemindDrawer @register="registerRemindDrawer" @success="reload" />
    <BatchRemindDrawer
      @register="registerBatchRemindDrawer"
      :updateApi="updateBillNote3Batch"
      field="note"
      batch
      help="这将同步替换单据下全部产品的备注3"
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
    billBack,
    exportBox,
    exportPackage,
    getBill,
    updateBillNote3Batch,
  } from '@/api/warehouse/bill';
  import { HxBill } from '@/ApiModel/warehouse/bill';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'Outbound' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));
  const RemindDrawer = createAsyncComponent(() => import('./Popup/UpdateDrawer.vue'));
  const BatchRemindDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/RemindDrawer.vue'),
  );
  const go = useGo();
  const { createMessage: msg, createConfirm } = useMessage();
  const { status, source, allMatch } = useExcelExportConfig();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerRemindDrawer, { openDrawer: openRemindDrawer }] = useDrawer();
  const [registerBatchRemindDrawer, { openDrawer: openBatchRemindDrawer }] = useDrawer();

  const [registerTable, { getSelectRows, getSelectRowKeys, reload }] = useTable({
    api: getBill,
    searchInfo: {
      type: 'OUT',
      isTable: true,
    },
    columns: getBillColumns('OUT'),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getBillFormConfig('OUT'),
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
      width: 80,
      title: '操作',
      dataIndex: 'action',
      auth: ['outboundManager_detail', 'outboundManager_updateInfo'],
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
            icon: 'fluent:note-pin-20-regular',
            tooltip: '更新单据信息',
            auth: 'outboundManager_updateInfo',
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
            tooltip: '出库明细',
            auth: 'outboundManager_detail',
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

  const handleBillBack = () => {
    const ids = getSelectRowKeys() as number[];
    if (ids.length === 0) {
      msg.warning('请选择需要退回的数据');
      return;
    }
    createConfirm({
      title: '提示？',
      iconType: 'warning',
      content: '是否确认退回？',
      onOk: async () => {
        await billBack(ids);
        msg.success('退回成功');
        reload();
      },
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
      query: { codes, ids, billType: 'OUT', title: '出库' },
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
