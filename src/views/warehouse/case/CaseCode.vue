<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button
          preIcon="ant-design:printer-outlined"
          @click="handleSelectPrinter"
          v-auth="'boxManager_print'"
        >
          打印
        </a-button>

        <ApiButton :api="handleExport" v-auth="'boxManager_export'"> 导出条码 </ApiButton>

        <a-button type="primary" danger ghost @click="handleDelete" v-auth="'boxManager_del'">
          批量删除
        </a-button>
      </template>
    </BasicTable>
    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['BOX', 'BOX_R']"
      storageKey="BOX"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { useGo } from '@/hooks/web/usePage';
  import { TableAction, useTable, BasicTable } from '@/components/Table';
  import { HashingFactory } from '@/utils/cipher';
  import { getBoxCodeColumns, getBoxCodeFormConfig, useExcelExportConfig } from '../TableColumns';
  import {
    deleteProduct,
    exportAllProduct,
    exportProduct,
    getProduct,
  } from '@/api/warehouse/product';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useI18n } from '@/hooks/web/useI18n';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'CaseCode' });

  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));

  const go = useGo();
  const { t } = useI18n();
  const { createMessage: msg, createConfirm } = useMessage();
  const { status, source, mix, fullBox } = useExcelExportConfig();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [
    registerTable,
    { getSelectRows, getSelectRowKeys, reload, clearSelectedRowKeys, getForm },
  ] = useTable({
    api: getProduct,
    searchInfo: {
      productType: 'BOX',
    },
    columns: getBoxCodeColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getBoxCodeFormConfig(),
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
      auth: ['boxManager_detail'],
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
            auth: 'boxManager_detail',
            onClick: () => {
              const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
              go({ path: '/warehouse/case_code/detail/' + md5, query: { id: record.id } });
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
      content: '请注意，执行该操作将同时删除选中箱的盒码信息。是否确定继续？',
      onOk: async () => {
        await deleteProduct(keys);
        msg.success(t('common.deleteSuccessMessage'));
        clearSelectedRowKeys();
        reload();
      },
    });
  };

  const handleExport = async () => {
    const rows = getSelectRows() as HxProduct[];
    if (rows.length === 0) {
      const form = getForm().getFieldsValue();
      form.productType = 'BOX';
      await exportAllProduct(form);
    } else {
      const codes = rows.map((item) => item.barCode);
      await exportProduct(codes);
    }
  };
</script>
