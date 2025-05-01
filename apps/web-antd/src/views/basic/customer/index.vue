<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { CustomerApi } from '#/api';

import { Button, InputSearch, Modal } from 'ant-design-vue';
import { h, reactive } from 'vue';
import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getCustomerListApi, deleteCustomerApi } from '#/api';
import ExtraModal from './modal.vue';

defineOptions({ name: `Customer` });

const form = reactive({
  keyword: '',
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'name', title: '名称', width: 200, fixed: 'left' },
    { field: 'pinyin', title: '拼音', width: 120 },
    { field: 'phone', title: '手机号', width: 120 },
    { field: 'contact', title: '联系人', width: 100 },
    { field: 'company', title: '公司名称', width: 150 },
    { field: 'taxNo', title: '税号', width: 200 },
    { field: 'bankName', title: '开户银行', width: 150 },
    { field: 'bankAccount', title: '银行账号', width: 150 },
    { field: 'bankHolder', title: '开户人', width: 100 },
    {
      field: 'bankAddress',
      title: '开户地址',
      width: 200,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'address',
      title: '地址',
      width: 200,
      align: 'left',
      headerAlign: 'center',
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
    {
      field: 'isDefault',
      title: '默认',
      width: 70,
      slots: {
        default: ({ row }) => {
          return row.isDefault === 1
            ? h('span', { class: 'bg-[#e8f2fd] text-[#2080f0] p-2' }, '是')
            : '';
        },
      },
    },
    {
      field: 'initialBalance',
      title: '期初余额',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    { field: 'createdAt', title: '创建时间', width: 145 },
    { field: 'updatedAt', title: '更新时间', width: 145 },
    {
      field: 'action',
      title: '操作',
      width: 120,
      fixed: 'right',
      slots: {
        default: 'action',
      },
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getCustomerListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...form,
        });
      },
    },
  },
};
const gridEvents: VxeGridListeners<CustomerApi.CustomerItem> = {
  cellDblclick: ({ row }) => handleEdit(row),
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const [CustomerModal, modalApi] = useVbenModal({
  connectedComponent: ExtraModal,
  destroyOnClose: true,
});
const handleAdd = () => {
  modalApi.setData({}).open();
};
const handleEdit = (row: CustomerApi.CustomerItem) => {
  modalApi.setData(row).open();
};
const handleDelete = (row: CustomerApi.CustomerItem) => {
  Modal.confirm({
    icon: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    title: '删除客户',
    content: h('div', null, [
      h('span', null, '您确定要删除 '),
      h('span', { class: 'text-red-500' }, `${row.name}`),
      h('span', null, ' 吗 ?'),
    ]),
    async onOk() {
      try {
        await deleteCustomerApi(row.id);
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
        placeholder="请输入编码、名称、拼音、联系人"
        class="w-80"
        enterButton="查询"
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
    <CustomerModal @refresh="handleRefresh" />
  </Page>
</template>
