<template>
  <PageWrapper dense contentFullHeight contentClass="flex">
    <BasicTable @register="registerTable">
      <template #toolbar>
        <a-button type="primary" @click="openModal(true, {})">新增账号</a-button>
      </template>
      <template #bodyCell="{ column }">
        <template v-if="column.key === 'action'">
          <TableAction :actions="[
            {
              icon: 'clarity:note-edit-line',
              tooltip: '编辑用户资料',
              onClick: () => openModal(true, {}),
            },
          ]" />
        </template>
      </template>
    </BasicTable>
    <AccountModal @register="registerModal" />
  </PageWrapper>
</template>
<script lang="ts" setup>
import { PageWrapper } from '@/components/Page';
import { getAccountList } from '@/api/demo/system';
import { useModal } from '@/components/Modal';
import { columns } from '@/views/demo/system/account/account.data';
import { BasicTable, TableAction, useTable, useTrackTableRow } from '@/components/Table';
import AccountModal from './AccountModal.vue'

const [registerTable, tableAction] = useTable({
  title: '账号列表',
  api: getAccountList,
  rowKey: 'id',
  columns,
  canResize: true,
  showTableSetting: true,
  bordered: true,
  actionColumn: {
    width: 120,
    title: '操作',
    dataIndex: 'action',
  },
});

useTrackTableRow(tableAction, { provide: true })
const [registerModal, { openModal }] = useModal();

</script>
