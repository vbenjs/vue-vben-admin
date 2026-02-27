<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Tag, Select, Popconfirm, message } from 'ant-design-vue';
import { sysPrintDesignApi } from '#/api/core/sys-manage';

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const searchParams = ref({ printName: '', status: undefined });

const columns = [
  { title: '模板名称', dataIndex: 'printName', key: 'printName' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 80 },
  { title: '创建人', dataIndex: 'createBy', key: 'createBy', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 160 },
  { title: '操作', key: 'action', width: 160 }
];

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await sysPrintDesignApi.getList({ page, pageSize: pagination.value.pageSize, ...searchParams.value });
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
  <Page title="打印设计" description="业务单据网页打印可视化模板设定。">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.printName" placeholder="模板名称" class="w-40" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">启用</Select.Option>
            <Select.Option value="1">禁用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.printName = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
          <Button type="primary" class="ml-auto">+ 新增</Button>
        </div>
        
        <Table 
          :columns="columns" 
          :dataSource="dataSource" 
          :loading="loading" 
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="printId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '启用' : '禁用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'createTime'">{{ formatDate(record.createTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">设计器</Button>
              <Button type="link" size="small">编辑</Button>
              <Popconfirm title="确定删除该打印模板吗？" @confirm="">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
