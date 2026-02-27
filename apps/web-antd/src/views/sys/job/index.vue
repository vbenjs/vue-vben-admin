<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Select } from 'ant-design-vue';
import { sysJobApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ jobName: '', jobGroup: '', status: undefined });

const columns = [
  { title: '任务名称', dataIndex: 'jobName', key: 'jobName' },
  { title: '任务组名', dataIndex: 'jobGroup', key: 'jobGroup', width: 100 },
  { title: '调用目标字符串', dataIndex: 'invokeTarget', key: 'invokeTarget' },
  { title: 'Cron表达式', dataIndex: 'cronExpression', key: 'cronExpression', width: 140 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 130 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysJobApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

onMounted(() => fetchList());
</script>

<template>
  <Page title="定时任务" description="基于Cron表达式的定时任务维护。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.jobName" placeholder="任务名称" class="w-36" allowClear />
          <Input v-model:value="searchParams.jobGroup" placeholder="任务分组" class="w-36" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">暂停</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.jobName = ''; searchParams.jobGroup = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
          <Button type="primary" class="ml-auto">＋ 新增</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="jobId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'warning'">
                {{ record.status === '0' ? '正常' : '暂停' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">{{ formatDate(record.createTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">编辑</Button>
              <Button type="link" size="small">日志</Button>
              <Button type="link" danger size="small">删除</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
