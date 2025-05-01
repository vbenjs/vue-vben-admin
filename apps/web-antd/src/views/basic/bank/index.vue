<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { BankApi } from '#/api';

import { Page, useVbenModal } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Button, InputSearch, Modal } from 'ant-design-vue';
import { reactive, h } from 'vue';
import { getBankListApi, deleteBankApi } from '#/api';
import ExtraModal from './modal.vue';

defineOptions({ name: `Bank` });

const form = reactive({
  keyword: '',
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'name', title: '名称', width: 200, fixed: 'left' },
    { field: 'holder', title: '开户人', width: 140 },
    { field: 'account', title: '账号', width: 220 },
    {
      field: 'address',
      title: '地址',
      width: 220,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'initialBalance',
      title: '期初余额',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'balance',
      title: '余额',
      width: 120,
      align: 'right',
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
        return await getBankListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...form,
        });
      },
    },
  },
};
const gridEvents: VxeGridListeners<BankApi.BankItem> = {
  cellDblclick: ({ row }) => handleEdit(row),
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const [BankModal, modalApi] = useVbenModal({
  connectedComponent: ExtraModal,
  destroyOnClose: true,
});
const handleAdd = () => {
  modalApi.setData({}).open();
};
const handleEdit = (row: BankApi.BankItem) => {
  modalApi.setData(row).open();
};
const handleDelete = (row: BankApi.BankItem) => {
  Modal.confirm({
    icon: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    title: '删除银行',
    content: h('div', null, [
      h('span', null, '您确定要删除 '),
      h('span', { class: 'text-red-500' }, `${row.name}`),
      h('span', null, ' 吗 ?'),
    ]),
    async onOk() {
      try {
        await deleteBankApi(row.id);
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
        placeholder="请输入编码、名称、账号、开户人"
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
    <BankModal @refresh="handleRefresh" />
  </Page>
</template>
