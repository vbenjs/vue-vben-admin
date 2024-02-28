<template>
  <div>
    <BasicTable @register="registerTable">
      <template #toolbar>
        <Space.Compact>
          <ApiButton :api="handleExportPackage" v-if="productType === 'PACKAGE'">
            导出盒明细
          </ApiButton>
          <ApiButton :api="handleExportBox" v-else> 导出箱明细 </ApiButton>
          <a-button preIcon="ant-design:printer-outlined" @click="handleSelectPrinter">
            打印
          </a-button>
        </Space.Compact>
      </template>
    </BasicTable>

    <BoxCaseDetailDrawer @register="registerDrawer" />
    <PrintDrawer
      @register="registerPrintDrawer"
      :templateType="templateType"
      :storageKey="storageKey"
      :isBill="isBill"
    />
  </div>
</template>
<script lang="tsx" setup>
  import { BasicTable, TableAction, useTable } from '@/components/Table';
  import { Space, message } from 'ant-design-vue';
  import { useGo } from '@/hooks/web/usePage';
  import {
    getPackageCodeColumns,
    getPackageCodeFormConfig,
    getBoxCodeColumns,
    getBoxCodeFormConfig,
  } from '../TableColumns';
  import { HxProduct } from '@/ApiModel/warehouse/product';
  import { useDrawer } from '@/components/Drawer';
  import { createAsyncComponent } from '@/utils/factory/createAsyncComponent';
  import { useMessage } from '@/hooks/web/useMessage';
  // import { useI18n } from '@/hooks/web/useI18n';
  import { exportBox, exportPackage, getProductDetail } from '@/api/warehouse/bill';
  import { onMounted, ref } from 'vue';
  import { useRoute } from 'vue-router';
  import { HashingFactory } from '@/utils/cipher';
  import { computed } from 'vue';
  import { exportAllProduct, exportProduct, getProduct } from '@/api/warehouse/product';
  import { ApiButton } from '@/components/Button';
  import { useTabs } from '@/hooks/web/useTabs';

  defineOptions({ name: 'ProductDetail' });

  const BoxCaseDetailDrawer = createAsyncComponent(
    () => import('@/views/warehouse/box/Popup/BoxCaseDetailDrawer.vue'),
  );
  const PrintDrawer = createAsyncComponent(() => import('@/views/warehouse/Popup/PrintDrawer.vue'));

  const billType = ref<string>('');
  const baseDataType = ref<string>('');
  const billCodes = ref<string[]>([]);
  const billIds = ref<string[]>([]);
  const productType = ref<string>('PACKAGE');
  const templateType = ref<string | string[]>('');
  const isBill = ref<boolean>(false);
  const storageKey = ref<string>('');
  const searchInfo = ref<Recordable>({});

  const go = useGo();
  const { setTitle } = useTabs();
  // const { t } = useI18n();
  const route = useRoute();
  const { createMessage: msg } = useMessage();
  const [registerDrawer, { openDrawer }] = useDrawer();
  const [registerPrintDrawer, { openDrawer: openPrintDrawer }] = useDrawer();
  const [registerTable, { getSelectRows, clearSelectedRowKeys, getForm }] = useTable({
    api: billType.value ? getProductDetail : getProduct,
    immediate: false,
    beforeFetch: (params) => {
      return { ...searchInfo.value, productType: productType.value, ...params };
    },
    columns: computed(() => {
      if (productType.value === 'PACKAGE') {
        return getPackageCodeColumns();
      } else {
        return getBoxCodeColumns();
      }
    }),
    rowKey: 'id',
    useSearchForm: true,
    formConfig: computed(() => {
      const data =
        productType.value === 'PACKAGE' ? getPackageCodeFormConfig() : getBoxCodeFormConfig();
      const packingDate = data.schemas?.find((item) => item.field === 'packingDate');
      packingDate!.defaultValue = undefined;

      const schemas = data.schemas?.filter((item) => {
        return ![
          `${baseDataType.value?.toLocaleLowerCase() + 'Id'}`,
          'noBoxCode',
          'noPalletCode',
        ].includes(item.field);
      });

      return {
        autoSubmitOnEnter: true,
        rowProps: { gutter: 12 },
        labelWidth: 80,
        submitOnChange: true,
        schemas: [
          {
            field: 'productType',
            label: '产品类型',
            component: 'Select',
            defaultValue: 'PACKAGE',
            componentProps: {
              options: [
                { label: '盒', value: 'PACKAGE' },
                { label: '箱', value: 'BOX' },
              ],
              allowClear: false,
              onChange: ((value: string) => {
                productType.value = value;
                clearSelectedRowKeys();
              }) as any,
            },
            colProps: { md: 8, xl: 6, xxl: 4 },
          },
          ...(schemas ?? []),
        ],
      };
    }),
    loading: true,
    showIndexColumn: false,
    showTableSetting: true,
    rowSelection: {
      type: 'checkbox',
    },
    actionColumn: {
      width: 60,
      title: '操作',
      dataIndex: 'action',
      customRender: ({ record }) => {
        return createActions(record as HxProduct);
      },
    },
    // showSelectionBar: true,
    clearSelectOnPageChange: true,
  });

  onMounted(() => {
    billType.value = route.query.billType as string;
    baseDataType.value = route.query.baseDataType as string;

    const codes = route.query.codes as string;
    billCodes.value = codes?.split(',') ?? [];

    const ids = route.query.ids as string;

    if (billType.value) {
      billIds.value = ids?.split(',');
      searchInfo.value = {
        billCodes: billCodes.value,
      };
    } else {
      searchInfo.value = {
        [baseDataType.value.toLocaleLowerCase() + 'Ids']: ids?.split(','),
      };
    }

    setTitle(`查看明细：${route.query.title ?? ''}`);
  });

  const createActions = (record: HxProduct) => {
    return (
      <TableAction
        stopButtonPropagation
        actions={[
          {
            icon: 'ant-design:info-circle-outlined',
            tooltip: '详情',
            onClick: () => {
              if (productType.value === 'PACKAGE') {
                openDrawer(true, record.id);
              } else {
                const md5 = HashingFactory.createMD5Hashing().hash(String(record.id));
                go({ path: '/warehouse/case_code/detail/' + md5, query: { id: record.id } });
              }
            },
          },
        ]}
      />
    );
  };

  const handleSelectPrinter = () => {
    let rows = getSelectRows() as any[];

    if (rows.length !== 0) {
      templateType.value = [productType.value, productType.value + '_R'];
      storageKey.value = productType.value;
      isBill.value = false;
    } else if (billType.value) {
      templateType.value = [
        billType.value,
        billType.value + '_PACKAGE',
        billType.value + '_BOX',
        billType.value + '_PALLET',
      ];
      isBill.value = true;
      storageKey.value = billType.value;
      rows = billIds.value.map((id) => ({ id }));
    } else {
      message.error('请选择需要打印的数据');
      return;
    }

    openPrintDrawer(true, {
      rows: rows,
    });
  };

  const handleExportPackage = async () => {
    const rows = getSelectRows() as HxProduct[];
    if (rows.length !== 0) {
      await exportProduct(rows.map((item) => item.barCode));
    } else if (billType.value) {
      await exportPackage(billCodes.value);
    } else {
      const form = getForm().getFieldsValue();
      form.productType = 'PACKAGE';
      await exportAllProduct({ ...searchInfo.value, productType: productType.value, ...form });
    }
    msg.success('导出成功');
  };

  const handleExportBox = async () => {
    const rows = getSelectRows() as HxProduct[];

    if (rows.length !== 0) {
      await exportProduct(rows.map((item) => item.barCode));
    } else if (billType.value) {
      await exportBox(billCodes.value);
    } else {
      const form = getForm().getFieldsValue();
      form.productType = 'BOX';
      await exportAllProduct({ ...searchInfo.value, productType: productType.value, ...form });
    }
    msg.success('导出成功');
  };
</script>
