<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag } from 'ant-design-vue';
import { sysOperLogApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ title: '', operName: '', status: undefined });

const columns = [
  { title: '系统模块', dataIndex: 'title', key: 'title' },
  { title: '操作人员', dataIndex: 'operName', key: 'operName' },
  { title: '主机', dataIndex: 'operIp', key: 'operIp' },
  { title: '操作地点', dataIndex: 'operLocation', key: 'operLocation' },
  { title: '状态', dataIndex: 'status', key: 'status' },
  { title: '操作日期', dataIndex: 'operTime', key: 'operTime' },
  { title: '消耗时间(ms)', dataIndex: 'costTime', key: 'costTime' },
  { title: '操作', key: 'action', width: 120 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysOperLogApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleClean = async () => {
  if (confirm('确认清空所有操作日志吗？此操作无法恢复。')) {
    await sysOperLogApi.clean();
    fetchList(1);
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="操作日志" description="系统正常的业务操作行为记录。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex gap-4">
          <Input v-model:value="searchParams.title" placeholder="系统模块" class="w-48" allowClear />
          <Input v-model:value="searchParams.operName" placeholder="操作人员" class="w-48" allowClear />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.title = ''; searchParams.operName = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
          <Button type="primary" danger ghost class="ml-auto" @click="handleClean">清空</Button>
        </div>
        
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="operId"
          bordered
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === 0 ? 'success' : 'error'">
                {{ record.status === 0 ? '成功' : '失败' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">详细</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
