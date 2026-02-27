<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag } from 'ant-design-vue';
import { sysJobApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ jobName: '', jobGroup: '' });

const columns = [
  { title: '任务名称', dataIndex: 'jobName', key: 'jobName' },
  { title: '任务组名', dataIndex: 'jobGroup', key: 'jobGroup' },
  { title: '调用目标字符串', dataIndex: 'invokeTarget', key: 'invokeTarget' },
  { title: 'Cron执行表达式', dataIndex: 'cronExpression', key: 'cronExpression' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime' },
  { title: '操作', key: 'action', width: 200 }
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

onMounted(() => fetchList());
</script>

<template>
  <Page title="定时任务" description="基于Cron表达式的定时任务维护。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.jobName" placeholder="任务名称" class="w-48" allowClear />
          <Input v-model:value="searchParams.jobGroup" placeholder="任务分组" class="w-48" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.jobName = ''; searchParams.jobGroup = ''; fetchList(1); }">重置</Button>
          <Button type="primary" ghost class="ml-auto">新增任务</Button>
        </div>
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="jobId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '暂停' }}
              </Tag>
            </template>
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
