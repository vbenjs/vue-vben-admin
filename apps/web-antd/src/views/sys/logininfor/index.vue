<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Popconfirm, message, Select } from 'ant-design-vue';
import { sysLogininforApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ userName: '', ipaddr: '', status: undefined });

const columns = [
  { title: '用户账号', dataIndex: 'userName', key: 'userName', width: 110 },
  { title: '登录IP', dataIndex: 'ipaddr', key: 'ipaddr', width: 120 },
  { title: '登录地点', dataIndex: 'loginLocation', key: 'loginLocation' },
  { title: '浏览器', dataIndex: 'browser', key: 'browser', width: 100 },
  { title: '操作系统', dataIndex: 'os', key: 'os', width: 100 },
  { title: '登录状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作提示', dataIndex: 'msg', key: 'msg' },
  { title: '登录日期', dataIndex: 'loginTime', key: 'loginTime', width: 160 },
  { title: '操作', key: 'action', width: 80 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysLogininforApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
  } finally {
    loading.value = false;
  }
};

const handleClean = async () => {
  await sysLogininforApi.clean();
  message.success('清空登录日志成功');
  fetchList(1);
};

const handleDelete = async (id: number | string) => {
  await sysLogininforApi.remove(id);
  message.success('删除成功');
  fetchList(pagination.value.current);
};

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

onMounted(() => fetchList());
</script>

<template>
  <Page title="登录日志" description="系统登录登出行为详情。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.userName" placeholder="用户账号" class="w-36" allowClear />
          <Input v-model:value="searchParams.ipaddr" placeholder="登录IP" class="w-36" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">成功</Select.Option>
            <Select.Option value="1">失败</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.userName = ''; searchParams.ipaddr = ''; fetchList(1); }">重置</Button>
          <Popconfirm title="确认清空所有登录记录吗？此操作无法恢复。" @confirm="handleClean">
            <Button type="primary" danger ghost class="ml-auto">清空</Button>
          </Popconfirm>
        </div>
        
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="infoId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '成功' : '失败' }}
              </Tag>
            </template>
            <template v-if="column.key === 'loginTime'">{{ formatDate(record.loginTime) }}</template>
            <template v-if="column.key === 'action'">
              <Popconfirm title="确定删除这日志吗？" @confirm="handleDelete(record.infoId)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
