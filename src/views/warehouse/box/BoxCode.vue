<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space.Compact>
          <a-button
            type="primary"
            preIcon="ant-design:plus-outlined"
            @click="handleCreate"
            v-auth="'packageManager_add'"
          >
            新建
          </a-button>
          <a-button
            type="primary"
            preIcon="bx:link"
            @click="handleLink"
            v-auth="'packageManager_bind'"
          >
            扫描生成
          </a-button>
          <a-button
            preIcon="ant-design:printer-outlined"
            @click="handleSelectPrinter"
            v-auth="'packageManager_print'"
          >
            打印
          </a-button>

          <ApiButton :api="handleExport" v-auth="'packageManager_export'"> 导出条码 </ApiButton>
        </Space.Compact>

        <a-button type="primary" danger ghost @click="handleDelete" v-auth="'packageManager_del'">
          批量删除
        </a-button>
      </template>
    </BasicTable>

    <BoxCaseDetailDrawer @register="registerDrawer" />
    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="['PACKAGE', 'PACKAGE_R']"
      storageKey="PACKAGE"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { Space } from 'ant-design-vue';
  import { useGo } from '@/hooks/web/usePage';
  import {
    getPackageCodeColumns,
    getPackageCodeFormConfig,
    useExcelExportConfig,
  } from '../TableColumns';
  import {
    deleteProduct,
    exportAllProduct,
    exportProduct,
    getProduct,
  } from '@/api/warehouse/product';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  import { useI18n } from '@/hooks/web/useI18n';
  import { ApiButton } from '@/components/Button';

  defineOptions({ name: 'BoxCode' });

  const BoxCaseDetailDrawer = createAsyncComponent(
    () => import('@/views/warehouse/box/Popup/BoxCaseDetailDrawer.vue'),
  );
  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));

  const go = useGo();
  const { t } = useI18n();
  const { createMessage: msg, createConfirm } = useMessage();
  const { status, source } = useExcelExportConfig();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [
    registerTable,
    { getSelectRows, getSelectRowKeys, reload, clearSelectedRowKeys, getForm },
  ] = useTable({
    api: getProduct,
    searchInfo: {
      productType: 'PACKAGE',
    },
    columns: getPackageCodeColumns(),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: getPackageCodeFormConfig(),
    // showTableSetting: true,
    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    tableSetting: { export: true },
    exportConfig: { status, source },
    rowSelection: {
      type: 'checkbox',
    },
    defSort: {
      columnKey: 'packingDate',
      order: 'descend',
    },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      auth: ['packageManager_detail'],
      customRender: ({ record }) => {
        return createActions(record as HxProduct);
      },
    },
    // showSelectionBar: true,
    clearSelectOnPageChange: true,
  });

  const createActions = (record: HxProduct) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            auth: 'packageManager_detail',
            onClick: () => {
              openDrawer(true, record.id);
            },
          },
        ]}
      />
    );
  };

  const handleCreate = () => {
    go('/warehouse/box_code/form');
  };

  const handleLink = () => {
    go('/warehouse/box_code/bind');
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
      content: '是否确认删除该数据？',
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
      form.productType = 'PACKAGE';
      await exportAllProduct(form);
    } else {
      const codes = rows.map((item) => item.barCode);
      await exportProduct(codes);
    }
  };
</script>
