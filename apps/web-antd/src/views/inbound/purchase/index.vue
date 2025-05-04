<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenForm } from '#/adapter/form';
import { Page } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import {
  getStoreAllApi,
  getSupplierAllApi,
  getBankAllApi,
  getUserAllApi,
  getPurchaseInitApi,
} from '#/api';
import { h, onMounted, reactive } from 'vue';
import { Button, ButtonGroup } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';
import { useTabs } from '@vben/hooks';
/**
 *
 临时数据
 */

/*
 */
const { closeCurrentTab } = useTabs();

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
        afterFetch: (data) => data.filter((item) => item.status === 1),
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
        afterFetch: (data) => data.filter((item) => item.status === 1),
        autoSelect: 'first',
      },
      fieldName: 'supplierId',
      label: '供货商',
      formItemClass: 'col-span-2',
    },
    {
      component: 'ApiSelect',
      componentProps: {
        allowClear: true,
        placeholder: '请选择经办人',
        api: getUserAllApi,
        valueField: 'id',
        labelField: 'realName',
        afterFetch: (data) =>
          data
            .filter((item) => item.status === 1)
            .map((item) => ({
              id: item.id,
              realName: `${item.id}.  ${item.realName}`,
            })),
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
        afterFetch: (data) => data.filter((item) => item.status === 1),
        autoSelect: 'first',
      },
      fieldName: 'bankId',
      label: '银行',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
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
      fieldName: 'payableAmount',
      label: '应付金额',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
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
      },
      fieldName: 'paidAmount',
      label: '实付金额',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
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
      },
      fieldName: 'arrearsAmount',
      label: '欠款金额',
      formItemClass: 'col-span-2',
    },
    {
      component: 'InputNumber',
      defaultValue: 0,
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
      },
      fieldName: 'discountAmount',
      label: '优惠金额',
      formItemClass: 'col-span-2',
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
      const totalPrice = data.reduce(
        (prev, curr) => (prev * 100 + curr.totalPrice * 100) / 100,
        0,
      );
      footerFormApi.setFieldValue('payableAmount', totalPrice);
      return totalPrice;
    }

    return null;
  });
  return [footerData];
};
const gridOptions: VxeGridProps = {
  size: 'mini',
  columns: [
    { field: 'seq', type: 'seq', width: 70 },
    { field: 'productId', title: '商品编码', width: 90 },
    { field: 'productName', title: '商品名称', width: 220 },
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
    // beforeEditMethod: ({ row, column }) => {
    //   return !!row?.id;
    // },
  },
  menuConfig: {
    body: {
      options: [
        [
          {
            code: 'add',
            name: '新增行',
            prefixConfig: { icon: 'vxe-icon-add', className: 'text-sky-500' },
            visible: true,
            disabled: false,
          },
          {
            code: 'delete',
            name: '删除行',
            prefixConfig: {
              icon: 'vxe-icon-delete',
              className: 'text-red-500',
            },
            visible: true,
            disabled: false,
          },
          {
            code: 'addSub',
            name: '插入行',
            prefixConfig: {
              icon: 'vxe-icon-add-sub',
              className: 'text-orange-500',
            },
            visible: true,
            disabled: false,
          },
          {
            code: 'refresh',
            name: '重新加载',
            prefixConfig: {
              icon: 'vxe-icon-refresh',
              className: 'text-green-500',
            },
            visible: true,
            disabled: false,
          },
        ],
      ],
    },
  },
  showFooter: true,
  mergeFooterItems: [{ row: 0, col: 1, rowspan: 1, colspan: 6 }],
  footerMethod: footerMethod,
};
const gridEvents = {
  menuClick({ menu }) {
    console.log(menu);
  },
  cellDblclick: ({ row, column }) => {
    console.log('cellDblclick', { row, column }, column.field);
  },
};
const [Grid, graidApi] = useVbenVxeGrid({ gridOptions, gridEvents });

const handleSave = async () => {
  const data = await graidApi.grid.getFullData();
  console.log(data);
};

onMounted(async () => {
  try {
    const { storeId, supplierId, handlerId, tradeAt, orderNo, items } =
      await getPurchaseInitApi();
    headerFormApi.setValues({
      storeId,
      supplierId,
      handlerId,
      tradeAt: dayjs(tradeAt),
      orderNo,
    });
    await graidApi.grid.loadData(items);
  } catch (error) {
    closeCurrentTab();
  }
});
</script>

<template>
  <Page auto-content-height>
    <template #title>
      <ButtonGroup>
        <Button>新增</Button>
        <Button class="CustomSuccessButton" @click="handleSave">保存</Button>
        <Button class="CustomPrimaryButton">修改</Button>
        <Button class="CustomWarningButton">审核</Button>
        <Button class="CustomInfoButton">反审</Button>
        <Button class="CustomErrorButton">删除</Button>
      </ButtonGroup>
    </template>

    <Grid ref="gridRef">
      <template #top>
        <HeaderForm />
      </template>
      <template #bottom>
        <div class="mt-2">
          <FooterForm />
        </div>
      </template>
    </Grid>
  </Page>
</template>
