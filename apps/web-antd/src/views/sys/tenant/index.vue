<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Modal, Form, FormItem, message } from 'ant-design-vue';
import { sysTenantApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const total = ref(0);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ tenantName: '' });

const columns = [
  { title: '租户名称', dataIndex: 'tenantName', key: 'tenantName' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysTenantApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    total.value = res?.total || 0;
    pagination.value.current = page;
    pagination.value.total = total.value;
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchList();
});
</script>

<template>
  <Page title="租户管理" description="多租户系统管理维护。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.tenantName" placeholder="请输入租户名称" class="w-64" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.tenantName = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto">新增租户</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="tenantId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">编辑</Button>
              <Button type="link" danger size="small">删除</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
