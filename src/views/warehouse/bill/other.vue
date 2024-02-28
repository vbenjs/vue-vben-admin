<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button @click="handleShowProduct" v-auth="'otherBill_showProduct'"> 查看明细 </a-button>
        <ApiButton :api="handleExportPackage" v-auth="'otherBill_exportPackage'">
          导出盒明细
        </ApiButton>
        <ApiButton :api="handleExportBox" v-auth="'otherBill_exportBox'"> 导出箱明细 </ApiButton>
        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'otherBill_print'"
        >
          打印
        </a-button>
        <a-button @click="handleUpdateNote" v-auth="'otherBill_note'"> 更新备注 </a-button>
      </template>
    </BasicTable>

    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="templateType"
      isBill
      :storageKey="storageKey"
    />
    <RemindDrawer @register="registerRemindDrawer" @success="reload" />
    <BatchRemindDrawer
      @register="registerBatchRemindDrawer"
      :updateApi="updateBillNoteBatch"
      field="note"
      batch
      help="这将同步替换单据下全部产品的备注5"
      @success="reload"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { useOptionStore } from '@/store/modules/options';
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { HashingFactory } from '@/utils/cipher';
  import { getBillColumns, getBillFormConfig, useExcelExportConfig } from '../TableColumns';
  import { exportBox, exportPackage, getBill, updateBillNoteBatch } from '@/api/warehouse/bill';
  import { HxBill } from '@/ApiModel/warehouse/bill';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  import { ref } from 'vue';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'other' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));
  const RemindDrawer = createAsyncComponent(() => import('./Popup/UpdateDrawer.vue'));
  const BatchRemindDrawer = createAsyncComponent(
    () => import('@/views/warehouse/Popup/RemindDrawer.vue'),
  );

  const templateType = ref<string[]>([]);
  const storageKey = ref('');

  const optionStore = useOptionStore();
  const go = useGo();
  const { status, source, allMatch } = useExcelExportConfig();
  const { createMessage: msg } = useMessage();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerRemindDrawer, { openDrawer: openRemindDrawer }] = useDrawer();
  const [registerBatchRemindDrawer, { openDrawer: openBatchRemindDrawer }] = useDrawer();

  const [registerTable, { reload, getSelectRows, getForm }] = useTable({
    api: getBill,
    searchInfo: {
      isTable: true,
    },
    columns: getBillColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getBillFormConfig(),
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
      auth: ['otherBill_detail', 'otherBill_updateInfo'],
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
            auth: 'otherBill_updateInfo',
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
            auth: 'otherBill_detail',
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
    const type = getForm().getFieldsValue().type;
    templateType.value = [type, type + '_PACKAGE', type + '_BOX', type + '_PALLET'];
    storageKey.value = type;
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
    const type = getForm().getFieldsValue().type;
    const title = optionStore.getOptionName(type, 'billType');
    go({
      path: '/warehouse/productDetail/' + md5,
      query: { codes, ids, billType: type, title: title },
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
