<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenForm } from '#/adapter/form';
import { useVbenModal, Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStoreAllApi,
  getSupplierAllApi,
  getBankAllApi,
  getUserAllApi,
  getPurchaseByIdApi,
  createPurchaseApi,
  auditByIdApi,
  unauditByIdApi,
  deletePurchaseApi,
  updatePurchaseApi,
} from '#/api';
import { h, onMounted, reactive, watch } from 'vue';
import { Button, ButtonGroup, message, Modal } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useTabs } from '@vben/hooks';
import { useRoute } from 'vue-router';
import { usePurchaseStore } from '#/store';
import ExtraModal from './modal.vue';

defineOptions({
  name: `Purchase`,
});
const route = useRoute();
const purchaseStore = usePurchaseStore();

const { closeCurrentTab } = useTabs();
const orderInfo = reactive({
  status: 0,
  id: undefined,
});
const [ProductModal, modalApi] = useVbenModal({
  // 连接抽离的组件
  connectedComponent: ExtraModal,
});
const [HeaderForm, headerFormApi] = useVbenForm({
  // 默认展开
  // 所有表单项共用，可单独在表单内覆盖
  commonConfig: {
    // 所有表单项
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 65,
  },
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择仓库',
        api: getStoreAllApi,
        valueField: 'id',
        labelField: 'name',
        afterFetch: (data) =>
          data.map((item) => ({
            id: item.id,
            name: item.name,
            disabled: item.status != 1,
          })),
        autoSelect: 'first',
      },
      fieldName: 'storeId',
      label: '仓库',
      formItemClass: 'col-span-2',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择供货商',
        api: getSupplierAllApi,
        valueField: 'id',
        labelField: 'name',
        afterFetch: (data) =>
          data.map((item) => ({
            id: item.id,
            name: item.name,
            disabled: item.status != 1,
          })),
        autoSelect: 'first',
      },
      fieldName: 'supplierId',
      label: '供货商',
      formItemClass: 'col-span-2',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择经办人',
        api: getUserAllApi,
        valueField: 'id',
        labelField: 'realName',
        afterFetch: (data) =>
          data.map((item) => ({
            id: item.id,
            realName: `${item.id}. ${item.realName}`,
            disabled: item.status != 1,
          })),
        allowClear: true,
      },
      fieldName: 'handlerId',
      label: '经办人',
      formItemClass: 'col-span-2',
    },
    {
      component: 'DatePicker',
      componentProps: {
        allowClear: false,
      },
      fieldName: 'tradeAt',
      label: '交易日期',
      defaultValue: dayjs(),
      formItemClass: 'col-span-2',
    },
    {
      component: 'Input',
      componentProps: {
        // disabled: true,
        readonly: true,
        class: 'text-red-500',
      },
      fieldName: 'orderNo',
      label: '单据编号',
      formItemClass: 'col-span-2',
    },
    // {
    //   component: h(
    //     'span',
    //     {
    //       class:
    //         'text-red-500 font-black border-2  border-red-500  !w-auto px-4 py-1 rounded-sm fixed top-100 ',
    //     },
    //     '已审核',
    //   ),
    //   formItemClass: 'col-span-2',
    //   fieldName: 'dd',
    //   // dependencies: {
    //   //   triggerFields: ['orderNo'],
    //   //   if: ({ orderNo }) => !orderNo,
    //   // },
    // },
  ],
  wrapperClass: 'grid-cols-4 md:grid-cols-6 xl:grid-cols-10',
  compact: true,
});
const [FooterForm, footerFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
    labelWidth: 65,
  },
  schema: [
    {
      component: 'ApiSelect',
      componentProps: {
        placeholder: '请选择银行',
        api: getBankAllApi,
        valueField: 'id',
        labelField: 'name',
        afterFetch: (data) =>
          data.map((item) => ({
            id: item.id,
            name: item.name,
            disabled: item.status != 1,
          })),
        autoSelect: 'first',
      },
      fieldName: 'bankId',
      label: '银行',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      fieldName: 'payableAmount',
      label: '应付金额',
      defaultValue: 0,
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        disabled: true,
        style: {
          border: 'none',
          borderBottom: '1px solid #e9e9e9',
          borderRadius: '0',
          boxShadow: 'none',
        },
      },
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'paidAmount',
      label: '实付金额',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        style: {
          border: 'none',
          borderBottom: '1px solid #e9e9e9',
          borderRadius: '0',
          boxShadow: 'none',
        },
        onChange: async (value) => {
          const { payableAmount } = await footerFormApi.getValues();
          const paidAmount = value > payableAmount ? payableAmount : value;
          const diff = payableAmount - paidAmount;
          footerFormApi.setValues({
            paidAmount: paidAmount,
            arrearsAmount: diff,
            discountAmount: 0,
          });
        },
      },
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'arrearsAmount',
      label: '欠款金额',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        style: {
          border: 'none',
          borderBottom: '1px solid #e9e9e9',
          borderRadius: '0',
          boxShadow: 'none',
        },
        onChange: async (value) => {
          const { payableAmount } = await footerFormApi.getValues();
          const arrearsAmount = value > payableAmount ? payableAmount : value;
          const diff = payableAmount - arrearsAmount;
          footerFormApi.setValues({
            paidAmount: diff,
            arrearsAmount: arrearsAmount,
            discountAmount: 0,
          });
        },
      },
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
      fieldName: 'discountAmount',
      label: '优惠金额',
      formItemClass: 'col-span-2',
      componentProps: {
        placeholder: '0.00',
        controls: false,
        precision: 2,
        min: 0,
        style: {
          border: 'none',
          borderBottom: '1px solid #e9e9e9',
          borderRadius: '0',
          boxShadow: 'none',
        },
        onChange: async (value) => {
          let { paidAmount, payableAmount, arrearsAmount } =
            await footerFormApi.getValues();
          if (value > payableAmount) {
            footerFormApi.setValues({
              discountAmount: payableAmount,
              paidAmount: 0,
              arrearsAmount: 0,
            });
            return;
          }
          arrearsAmount = arrearsAmount > value ? arrearsAmount - value : 0;
          paidAmount = payableAmount - value - arrearsAmount;
          footerFormApi.setValues({
            paidAmount: paidAmount,
            arrearsAmount: arrearsAmount,
          });
        },
      },
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: '请输入备注',
        style: {
          border: 'none',
          borderBottom: '1px solid #e9e9e9',
          borderRadius: '0',
          boxShadow: 'none',
        },
      },
      fieldName: 'desc',
      label: '备注',
      formItemClass: 'col-span-full',
    },
  ],
  wrapperClass: 'grid-cols-4 md:grid-cols-6 xl:grid-cols-10',
  compact: true,
});

const footerMethod = ({ columns, data }) => {
  const footerData = columns.map((column, columnIndex) => {
    if (columnIndex === 0) {
      return `合计：`;
    }
    if (column.field === 'num') {
      return data.reduce((prev, curr) => prev + Number(curr.num), 0);
    }
    if (column.field === 'totalPrice') {
      const totalPrice =
        data.reduce(
          (prev, curr) => prev + Math.round(curr.totalPrice * 100),
          0,
        ) / 100;
      footerFormApi.setValues({
        payableAmount: totalPrice,
        paidAmount: totalPrice,
        arrearsAmount: 0,
        discountAmount: 0,
      });
      return totalPrice;
    }

    return null;
  });
  return [footerData];
};
const gridOptions: VxeGridProps = {
  size: 'mini',
  columns: [
    // {
    //   width: 60,
    // },
    {
      field: 'seq',
      type: 'seq',
      width: 50,
      // slots: {
      //   default: ({ row, seq, rowIndex }) => {
      //     return row?.seq == seq && !orderInfo.status ? 'test' : seq;
      //   },
      // },
    },
    { field: 'productId', title: '产品编码', width: 70 },
    { field: 'productName', title: '产品名称', width: 220 },
    { field: 'productSpec', title: '规格', width: 100 },
    {
      field: 'productBrand',
      title: '品牌',
      width: 80,
    },
    { field: 'productUnit', title: '单位', width: 80 },
    {
      field: 'productColor',
      title: '颜色',
      width: 80,
    },
    {
      field: 'num',
      title: '数量',
      width: 90,
      editRender: {
        name: 'VxeNumberInput',
        props: { type: 'integer', min: 1 },
        events: {
          change: ({ row }) => {
            row.totalPrice = (row.price * 100 * row.num) / 100;
          },
        },
      },
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'price',
      title: '价格',
      width: 120,
      editRender: {
        name: 'VxeNumberInput',
        props: { type: 'amount', min: 0, digits: 2, controls: false },
        events: {
          change: ({ row }) => {
            row.totalPrice = (row.price * 100 * row.num) / 100;
          },
        },
      },
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'totalPrice',
      title: '金额',
      width: 120,
      editRender: {
        name: 'VxeNumberInput',
        props: { type: 'amount', min: 0, digits: 2, controls: false },
        events: {
          change: ({ row }) => {
            row.price = ((row.totalPrice * 100) / row.num / 100).toFixed(2);
          },
        },
      },
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'desc',
      title: '备注',
      width: 180,
      align: 'left',
      headerAlign: 'center',
      editRender: {
        name: 'VxeInput',
        props: {
          placeholder: '请输入备注',
          maxlength: 100,
          trim: true,
        },
      },
    },
  ],
  pagerConfig: {
    enabled: false,
  },
  editConfig: {
    mode: 'cell',
    trigger: 'click',
    autoClear: true,
    beforeEditMethod: ({ row, column }) => {
      gridApi.grid.clearEdit();
      return !!row?.productId && orderInfo.status === 0;
    },
  },
  menuConfig: {
    enabled: true,
    body: {
      options: [
        [
          {
            code: 'insert',
            name: '新增行',
            prefixConfig: { icon: 'vxe-icon-add' },
          },
          {
            code: 'insertAt',
            name: '插入行',
            prefixConfig: {
              icon: 'vxe-icon-upload',
              className: 'text-sky-500',
            },
          },
          {
            code: 'remove',
            name: '删除行',
            prefixConfig: {
              icon: 'vxe-icon-delete',
              className: 'text-red-500',
            },
          },
          {
            code: 'clear',
            name: '清空',
            prefixConfig: { icon: 'vxe-icon-repeat' },
          },
        ],
      ],
    },
    visibleMethod: ({ options, $table, row }) => {
      const fullData = $table.getFullData();
      const len = fullData.length;
      options[0].forEach((list) => {
        if (list.code === 'remove') {
          list.disabled = len === 1;
        } else {
          list.disabled = len > 29;
        }
      });
      if (!row || orderInfo.status !== 0) {
        return false;
      }
      return true;
    },
  },
  showFooter: true,
  mergeFooterItems: [{ row: 0, col: 1, rowspan: 1, colspan: 6 }],
  footerMethod: footerMethod,
};
const InitRow = {
  desc: '',
  num: 1,
  price: 0,
  productBrand: '',
  productColor: '',
  productId: null,
  productName: '',
  productSpec: '',
  productUnit: '',
  totalPrice: 0,
};
const gridEvents = {
  cellDblclick: ({ row, column }) => {
    if (orderInfo.status !== 0) {
      return;
    }
    if (column.field === 'productId' || column.field === 'productName') {
      modalApi.open();
    }
  },
  cellMenu: ({ $grid, row }) => {
    $grid.setCurrentRow(row);
  },
  menuClick: ({ $grid, menu, row }) => {
    switch (menu.code) {
      case 'insert':
        $grid.insertAt(InitRow, -1);
        break;
      case 'insertAt':
        $grid.insertAt(InitRow, row);
        break;
      case 'remove':
        $grid.remove(row);
        break;
      case 'clear':
        hadnleClear();
        break;
    }
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const hadnleClear = async () => {
  await gridApi.grid.loadData([]);
  for (let i = 0; i < 8; i++) {
    const row = await gridApi.grid.insertAt(InitRow, -1);
  }
};
const handleSave = async () => {
  const fullData = await gridApi.grid.getFullData();
  const data = [];
  for (const { _X_ROW_KEY, ...item } of fullData) {
    if (!item?.productId) {
      continue;
    }
    data.push(item);
  }
  if (data.length === 0) {
    message.error('请添加产品');
    return;
  }

  const { tradeAt, ...headerValues } = await headerFormApi.getValues();
  const footerValues = await footerFormApi.getValues();

  try {
    if (orderInfo.id) {
      await updatePurchaseApi({
        id: orderInfo.id,
        ...headerValues,
        ...footerValues,
        tradeAt: tradeAt.format('YYYY-MM-DD'),
        items: data,
      });
    } else {
      const { id } = await createPurchaseApi({
        ...headerValues,
        ...footerValues,
        tradeAt: tradeAt.format('YYYY-MM-DD'),
        items: data,
      });
      orderInfo.id = id;
    }

    purchaseStore.$patch((state) => {
      state.purchaseId = orderInfo.id;
      state.refreshView = !state.refreshView;
    });
  } catch (e) {}
};
const handleEdit = async () => {
  orderInfo.status = 0;
};
const handleAudit = async () => {
  try {
    await auditByIdApi({
      id: orderInfo.id,
    });
    orderInfo.status = 2;
  } catch (e) {}
};
const handleUnaudit = async () => {
  try {
    await unauditByIdApi({
      id: orderInfo.id,
    });
    orderInfo.status = 1;
  } catch (e) {}
};
const handleDelete = async () => {
  const { orderNo } = await headerFormApi.getValues();
  Modal.confirm({
    icon: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    title: '删除采购入库单',
    content: h('div', null, [
      h('div', { class: 'text-red-500 font-black' }, `数据不可逆,请谨慎操作`),
      h('span', null, '您确定要删除 '),
      h('span', { class: 'text-red-500' }, `单据编号: ${orderNo}`),
      h('span', null, ' 吗 ?'),
    ]),
    async onOk() {
      try {
        await deletePurchaseApi(orderInfo.id);
        purchaseStore.$patch((state) => {
          state.purchaseId = 0;
          state.refreshView = !state.refreshView;
        });
      } catch {}
    },
  });
};
const handleAdd = async () => {
  purchaseStore.$patch((state) => {
    state.purchaseId = 0;
    state.refreshView = !state.refreshView;
  });
};
const handleRefresh = async () => {
  try {
    const {
      storeId,
      supplierId,
      handlerId,
      tradeAt,
      orderNo,
      bankId,
      arrearsAmount,
      discountAmount,
      paidAmount,
      payableAmount,
      status,
      desc,
      items,
      id,
    } = await purchaseStore.getPurchaseData();

    await gridApi.grid.loadData(items);
    headerFormApi.setValues({
      storeId,
      supplierId,
      handlerId,
      tradeAt: dayjs(tradeAt),
      orderNo,
    });
    footerFormApi.setValues({
      bankId,
      arrearsAmount,
      discountAmount,
      paidAmount,
      payableAmount,
      desc,
    });
    orderInfo.status = status;
    orderInfo.id = id;
  } catch (error) {
    closeCurrentTab();
  }
};
const handleAccept = async (acceptData, colse) => {
  const fulldata = await gridApi.grid.getFullData();
  const data = fulldata.filter((item) => !!item.productId);
  if (data.length + acceptData.length > 30) {
    message.error(`最多只能添加30条产品`);
    return;
  }
  data.push(...acceptData);
  await gridApi.grid.loadData(data);

  const diff = 8 - data.length;
  if (diff > 0) {
    for (let i = 0; i < diff; i++) {
      const row = await gridApi.grid.insertAt(InitRow, -1);
    }
  } else {
    const row = await gridApi.grid.insertAt(InitRow, -1);
  }
  if (colse) {
    modalApi.close();
  }
};
const setupWatch = () => {
  watch(
    () => purchaseStore.refreshView,
    () => handleRefresh(),
    { deep: false, immediate: true },
  );
  watch(
    () => orderInfo.status,
    () => {
      if (orderInfo.status === 0) {
        headerFormApi.setState({ commonConfig: { disabled: false } });
        footerFormApi.setState({ commonConfig: { disabled: false } });
      } else {
        headerFormApi.setState({ commonConfig: { disabled: true } });
        footerFormApi.setState({ commonConfig: { disabled: true } });
      }
    },
    { deep: false, immediate: true },
  );
};
// 在组件挂载完成后设置 watch
onMounted(() => {
  setupWatch();
});
</script>

<template>
  <Page auto-content-height>
    <template #title>
      <ButtonGroup>
        <Button :disabled="orderInfo.status === 0" @click="handleAdd">
          新增
        </Button>
        <Button
          class="CustomSuccessButton"
          :disabled="orderInfo.status === 1 || orderInfo.status === 2"
          @click="handleSave"
        >
          保存
        </Button>
        <Button
          class="CustomPrimaryButton"
          :disabled="orderInfo.status !== 1"
          @click="handleEdit"
        >
          修改
        </Button>
        <Button
          class="CustomWarningButton"
          :disabled="orderInfo.status !== 1"
          @click="handleAudit"
        >
          审核
        </Button>
        <Button
          class="CustomInfoButton"
          :disabled="orderInfo.status !== 2"
          @click="handleUnaudit"
        >
          反审
        </Button>
        <Button
          class="CustomErrorButton"
          :disabled="!orderInfo.id || orderInfo.status !== 1"
          @click="handleDelete"
        >
          删除
        </Button>
      </ButtonGroup>
    </template>

    <Grid>
      <template #top>
        <HeaderForm />
      </template>
      <template #bottom>
        <div class="mt-2">
          <FooterForm />
        </div>
      </template>
    </Grid>
    <ProductModal @accept="handleAccept" />
  </Page>
</template>
