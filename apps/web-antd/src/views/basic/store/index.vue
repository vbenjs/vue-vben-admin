<script lang="ts" setup>
import type { VxeGridProps, VxeGridListeners } from '#/adapter/vxe-table';
import type { StoreApi } from '#/api';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { Page, useVbenModal } from '@vben/common-ui';
import { InputSearch, Button, Modal } from 'ant-design-vue';
import { getStoreListApi, deleteStoreApi } from '#/api';
import { reactive, h } from 'vue';
import ExtraModal from './modal.vue';

defineOptions({ name: 'Store' });

const form = reactive({
  keyword: undefined,
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'name', title: '名称', width: 200, fixed: 'left' },
    { field: 'contact', title: '联系人', width: 120 },
    { field: 'phone', title: '手机号', width: 120 },
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
      field: 'address',
      title: '地址',
      width: 200,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'desc',
      title: '备注',
      width: 200,
      align: 'left',
      headerAlign: 'center',
    },
    {
      field: 'createdAt',
      title: '创建时间',
      width: 145,
    },
    { field: 'updatedAt', title: '更新时间', width: 145 },
    {
      field: 'action',
      title: '操作',
      width: 120,
      slots: {
        default: 'action',
      },
      fixed: 'right',
    },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getStoreListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          ...form,
        });
      },
    },
  },
};
const gridEvents: VxeGridListeners<StoreApi.StoreItem> = {
  cellDblclick: ({ row }) => handleEdit(row),
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions, gridEvents });
const [StoreModal, modalApi] = useVbenModal({
  connectedComponent: ExtraModal,
  destroyOnClose: true,
});
const handleAdd = () => {
  modalApi.setData({}).open();
};
const handleEdit = (row: StroeApi.StroeItem) => {
  modalApi.setData(row).open();
};
const handleDelete = (row: StroeApi.StroeItem) => {
  Modal.confirm({
    icon: null,
    centered: true,
    maskClosable: false,
    destroyOnClose: true,
    title: '删除仓库',
    content: h('div', null, [
      h('span', null, '您确定要删除 '),
      h('span', { class: 'text-red-500' }, `${row.name}`),
      h('span', null, ' 吗 ?'),
    ]),
    async onOk() {
      try {
        await deleteStoreApi(row.id);
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
        class="w-96"
        placeholder="请输入编码、名称、联系人、手机号"
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
    <StoreModal @refresh="handleRefresh" />
  </Page>
</template>
