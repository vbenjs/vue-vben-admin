<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'palletManager_print'"
        >
          打印
        </a-button>
        <a-button type="primary" danger ghost @click="handleDelete" v-auth="'palletManager_del'">
          批量删除
        </a-button>
      </template>
    </BasicTable>
    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['PALLET', 'PALLET_R']"
      storageKey="PALLET"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { HashingFactory } from '@/utils/cipher';
  import {
    getPalletCodeColumns,
    getPalletCodeFormConfig,
    useExcelExportConfig,
  } from '../TableColumns';
  import { deleteProduct, getProduct } from '@/api/warehouse/product';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useI18n } from '@/hooks/web/useI18n';

  defineOptions({ name: 'PalletCode' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));

  const go = useGo();
  const { t } = useI18n();
  const { createMessage: msg, createConfirm } = useMessage();
  const { status, source, mix, fullBox } = useExcelExportConfig();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerTable, { getSelectRows, getSelectRowKeys, reload, clearSelectedRowKeys }] =
    useTable({
      api: getProduct,
      searchInfo: {
        productType: 'PALLET',
      },
      columns: getPalletCodeColumns(),
      rowKey: 'id',
      useSearchForm: true,
      formConfig: getPalletCodeFormConfig(),
      // showTableSetting: true,
      loading: true,
      showIndexColumn: false,
      showTableSetting: true,
      tableSetting: { export: true },
      exportConfig: { status, source, mix, fullBox },
      rowSelection: {
        type: 'checkbox',
      },
      defSort: {
        columnKey: 'packingDate',
        order: 'descend',
      },
      actionColumn: {
        width: 80,
        title: '操作',
        dataIndex: 'action',
        auth: ['palletManager_detail'],
        customRender: ({ record }) => {
          return createActions(record);
        },
      },
      clearSelectOnPageChange: true,
    });

  const createActions = (record: any) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            auth: 'palletManager_detail',
            onClick: () => {
              const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
              go({ path: '/warehouse/pallet_code/detail/' + md5, query: { id: record.id } });
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

  const handleDelete = () => {
    const keys = getSelectRowKeys() as number[];
    if (keys.length === 0) return msg.warning('请选择需要删除的数据！');
    createConfirm({
      title: '提示',
      iconType: 'warning',
      content: '请注意，执行该操作将同时删除选中托的盒码和箱码信息。是否确定继续？',
      onOk: async () => {
        await deleteProduct(keys);
        msg.success(t('common.deleteSuccessMessage'));
        clearSelectedRowKeys();
        reload();
      },
    });
  };
</script>
