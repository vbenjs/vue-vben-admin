<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { ProductApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getProductListApi, deleteProductApi } from '#/api';
import { Button, InputSearch, Modal } from 'ant-design-vue';
import { reactive, h } from 'vue';
import ExtraModal from './modal.vue';

defineOptions({ name: `Product` });

const form = reactive({
  keyword: '',
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'name', title: '名称', width: 200, fixed: 'left' },
    { field: 'pinyin', title: '拼音', width: 150 },
    { field: 'barcode', title: '条码', width: 150 },
    { field: 'brand', title: '品牌', width: 100 },
    { field: 'color', title: '颜色', width: 70 },
    { field: 'unit', title: '单位', width: 70 },
    { field: 'spec', title: '规格', width: 100 },
    {
      field: 'purchasePrice',
      title: '采购价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'salePrice',
      title: '销售价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'maxPrice',
      title: '最高进价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'minPrice',
      title: '最低售价',
      width: 100,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'maxLimit',
      title: '最高上限',
      width: 80,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'minLimit',
      title: '最低下限',
      width: 80,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'isVirtual',
      title: '劳务',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.isVirtual === 1
            ? h('span', { class: 'bg-[#e8f2fd] text-[#2080f0] p-2' }, '是')
            : '';
        },
      },
    },
    {
      field: 'status',
      title: '状态',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.status === 1
            ? h('span', { class: 'bg-[#e7f5ee] text-[#18a058] p-2 ' }, '正常')
            : h('span', { class: 'bg-[#fbeff1] text-[#d03050] p-2' }, '禁用');
        },
      },
    },
    { field: 'createdAt', title: '创建时间', width: 145 },
    { field: 'updatedAt', title: '更新时间', width: 145 },
    {
      field: 'action',
      title: '操作',
      width: 100,
      slots: {
        default: 'action',
      },
      fixed: 'right',
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getProductListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...form,
        });
      },
    },
  },
};
const gridEvents: VxeGridListeners<ProductApi.ProductItem> = {
  cellDblclick: ({ row }) => handleEdit(row),
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const [ProductModal, modalApi] = useVbenModal({
  connectedComponent: ExtraModal,
  destroyOnClose: true,
});
const handleAdd = () => {
  modalApi.setData({}).open();
};
const handleEdit = (row: ProductApi.ProductItem) => {
  modalApi.setData(row).open();
};
const handleDelete = (row: ProductApi.ProductItem) => {
  Modal.confirm({
    icon: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    title: '删除产品',
    content: h('div', null, [
      h('span', null, '您确定要删除 '),
      h('span', { class: 'text-red-500' }, `${row.name}`),
      h('span', null, ' 吗 ?'),
    ]),
    async onOk() {
      try {
        await deleteProductApi(row.id);
        gridApi.query();
      } catch {}
    },
  });
};
const handleRefresh = (code: 'query' | 'reload') => {
  if (code === 'query') {
    gridApi.query();
  } else {
    gridApi.reload();
  }
};
</script>
<template>
  <Page auto-content-height>
    <template #title>
      <InputSearch
        v-model:value="form.keyword"
        class="w-80"
        placeholder="请输入编码、名称、拼音码、条码"
        enter-button="查询"
        allowClear
        @search="handleRefresh('reload')"
      />
    </template>
    <template #extra>
      <Button type="primary" @click="handleAdd">新增</Button>
    </template>
    <Grid>
      <template #action="{ row }">
        <Button type="link" size="small" @click="handleEdit(row)">修改</Button>
        <Button type="link" danger size="small" @click="handleDelete(row)">
          删除
        </Button>
      </template>
    </Grid>
    <ProductModal @refresh="handleRefresh" />
  </Page>
</template>
