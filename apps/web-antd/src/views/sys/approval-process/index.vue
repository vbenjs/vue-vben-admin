<script lang="ts" setup>
// @ts-nocheck
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Input,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { sysApprovalProcessApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ processName: '', status: undefined });

const columns = [
  { title: '审批流名称', dataIndex: 'processName', key: 'processName' },
  { title: '关联表单 ID', dataIndex: 'formId', key: 'formId', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 180 },
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysApprovalProcessApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const formatDate = (v: string) =>
  v ? new Date(v).toLocaleString('zh-CN') : '-';

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.processName"
            placeholder="审批流名称"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">启用中</Select.Option>
            <Select.Option value="1">已停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.processName = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" class="ml-auto">+ 新增</Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="processId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用中' : '已停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">设计流程图</Button>
              <Button type="link" size="small">编辑</Button>
              <Popconfirm title="确定删除该审批流吗？">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
