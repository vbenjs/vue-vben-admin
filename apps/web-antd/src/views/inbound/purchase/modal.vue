<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';

import { useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { InputSearch, Button, message } from 'ant-design-vue';
import { h } from 'vue';

const emit = defineEmits(['accept']);
const [Modal, modalApi] = useVbenModal();

const gridOptions: VxeGridProps = {
  columns: [
    { type: 'checkbox', width: 40, fixed: 'left' },
    { field: 'productName', title: '产品名称', width: 180 },
    { field: 'productPinyin', title: '拼音码', width: 100 },
    { field: 'productBrand', title: '品牌', width: 80 },
    { field: 'productColor', title: '颜色', width: 80 },
    { field: 'productUnit', title: '单位', width: 80 },
    { field: 'productSpec', title: '规格', width: 120 },
    { field: 'productBarCode', title: '条码', width: 120 },
    {
      field: 'productPurchasePrice',
      title: '采购价',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productLastPurchasePrice',
      title: '上次采购价',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'productIsVirtual',
      title: '劳务',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.productIsVirtual === 1
            ? h('span', { class: 'bg-[#e8f2fd] text-[#2080f0] p-2' }, '是')
            : '';
        },
      },
    },
  ],
  data: [
    {
      productId: 1,
      productName: '测试1',
      productPinyin: '测试1',
      productBrand: '测试1',
      productColor: '测试1',
      productUnit: '测试1',
      productSpec: '测试1',
      productBarCode: '测试1',
      productPurchasePrice: 3.36,
      productLastPurchasePrice: 3.76,
      productIsVirtual: 1,
    },
    {
      productId: 2,
      productName: '测试2',
      productPinyin: '测试2',
      productBrand: '测试2',
      productColor: '测试2',
      productUnit: '测试2',
      productSpec: '测试2',
      productBarCode: '测试2',
      productPurchasePrice: 2.16,
      productLastPurchasePrice: 4.36,
      productIsVirtual: 0,
    },
  ],
};
const gridEvents = {
  cellDblclick: ({ row, column }) => {
    hanandleAccept([row], true);
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const hanandleAccept = async (data: any[], close: boolean) => {
  const acceptData = [];
  for (const item of data) {
    acceptData.push({
      productId: item.productId,
      productName: item.productName,
      productBrand: item.productBrand,
      productColor: item.productColor,
      productUnit: item.productUnit,
      productSpec: item.productSpec,
      productIsVirtual: item.productIsVirtual,
      num: 1,
      price: item.productPurchasePrice,
      totalPrice: item.productPurchasePrice,
    });
  }
  emit('accept', acceptData, close);
};
const handleAdd = async (close: boolean) => {
  const data = await gridApi.grid.getCheckboxRecords();
  if (data.length === 0) {
    message.error('请选择要添加的产品');
    return;
  }
  await hanandleAccept(data, close);
};
const handleClose = async () => handleAdd(true);
</script>
<template>
  <Modal
    title="产品列表"
    class="h-full w-2/3"
    centered
    appendToMain
    :fullscreen-button="false"
    destroyOnClose
    :footer="false"
    :closeOnClickModal="false"
  >
    <div class="flex h-full flex-col justify-center py-4">
      <div class="flex gap-2 px-2">
        <InputSearch
          placeholder="请输入产品编码、名称、拼音码、条码"
          enterButton="查询"
        />
        <Button type="primary" @click="handleAdd(false)"> 添加到单据 </Button>

        <Button type="primary" danger @click="handleClose">
          添加到单据并关闭
        </Button>
      </div>
      <div class="h-full">
        <Grid> </Grid>
      </div>
    </div>
  </Modal>
</template>
