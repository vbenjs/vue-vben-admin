<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="handleShowProduct" v-auth="'qualityBill_showProduct'">
          查看明细
        </a-button>
        <Space.Compact>
          <ApiButton :api="handleExportBill" v-auth="'qualityBill_exportBill'">
            导出单据
          </ApiButton>
          <ApiButton :api="handleExportPackage" v-auth="'qualityBill_exportPackage'">
            导出盒明细
          </ApiButton>
          <ApiButton :api="handleExportBox" v-auth="'qualityBill_exportBox'">
            导出箱明细
          </ApiButton>
        </Space.Compact>
        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'qualityBill_print'"
        >
          打印
        </a-button>
      </template>
    </BasicTable>

    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['QUALITY', 'QUALITY_PACKAGE', 'QUALITY_BOX', 'QUALITY_PALLET']"
      isBill
      storageKey="QUALITY"
    />
    <RemindDrawer @register="registerRemindDrawer" @success="reload" />
  </div>
</template>
<script lang="tsx" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { HashingFactory } from '@/utils/cipher';
  import { getBillColumns, getBillFormConfig, useExcelExportConfig } from '../TableColumns';
  import { exportBill, exportBox, exportPackage, getBill } from '@/api/warehouse/bill';
  import { HxBill } from '@/ApiModel/warehouse/bill';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ApiButton } from '@/components/Button';
  import { Space } from 'ant-design-vue';

  defineOptions({ name: 'Quality' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));
  const RemindDrawer = createAsyncComponent(() => import('./Popup/UpdateDrawer.vue'));

  const go = useGo();
  const { status, source, allMatch } = useExcelExportConfig();
  const { createMessage: msg } = useMessage();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerRemindDrawer, { openDrawer: openRemindDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows }] = useTable({
    api: getBill,
    searchInfo: {
      type: 'QUALITY',
      isTable: true,
    },
    columns: getBillColumns('QUALITY'),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getBillFormConfig('QUALITY'),
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
      auth: ['qualityBill_detail', 'qualityBill_updateInfo'],
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
            auth: 'qualityBill_updateInfo',
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
            tooltip: '单据明细',
            auth: 'qualityBill_detail',
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
      msg.error('请选择需要打印的数据');
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

  const handleExportBill = async () => {
    const rows = getSelectRows() as HxBill[];
    if (rows.length === 0) {
      msg.warning('请选择需要导出的数据');
      return;
    }
    await exportBill(
      rows.map((o) => o.id),
      'QUALITY',
    );
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
      query: { codes, ids, billType: 'QUALITY', title: '质量托单' },
    });
  };
</script>
