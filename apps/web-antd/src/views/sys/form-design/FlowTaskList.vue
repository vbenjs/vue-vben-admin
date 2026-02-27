<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Select, Tag } from 'ant-design-vue';

/**
 * 表单流程 - 工作流列表共用组件
 * 用于：发起流程 / 待办流程 / 已办流程 / 抄送流程 / 我的提交
 */
interface FlowTaskListProps {
  title: string;
  description: string;
  /** 数据过滤条件，后端接口按类型区分 */
  queryType: 'initiate' | 'todo' | 'done' | 'cc' | 'my-submit';
}

const props = defineProps<FlowTaskListProps>();

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({ keyword: '', flowNo: '', status: undefined });

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '流程编号', dataIndex: 'flowNo', key: 'flowNo', width: 160 },
  { title: '审批状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '当前节点', dataIndex: 'currentNode', key: 'currentNode', width: 120 },
  { title: '申请人', dataIndex: 'applyUser', key: 'applyUser', width: 100 },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
  { title: '操作', key: 'action', width: 180 },
];

const statusMap: Record<string, { text: string; color: string }> = {
  '0': { text: '审核中', color: 'processing' },
  '1': { text: '已通过', color: 'success' },
  '2': { text: '已拒绝', color: 'error' },
  '3': { text: '已撤回', color: 'default' },
};

const formatDate = (v: string) => (v ? new Date(v).toLocaleString('zh-CN') : '-');

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    // TODO: 接入真实流程工作台 API（根据 queryType 查询不同数据）
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page :title="title" :description="description">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex gap-3 flex-wrap">
          <Input v-model:value="searchParams.keyword" placeholder="标题" class="w-40" allowClear />
          <Input v-model:value="searchParams.flowNo" placeholder="流程编号" class="w-40" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">审核中</Select.Option>
            <Select.Option value="1">已通过</Select.Option>
            <Select.Option value="2">已拒绝</Select.Option>
            <Select.Option value="3">已撤回</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.keyword = ''; searchParams.flowNo = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
        </div>

        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="flowId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="statusMap[record.status]?.color || 'default'">
                {{ statusMap[record.status]?.text || record.status }}
              </Tag>
            </template>
            <template v-if="column.key === 'applyTime'">{{ formatDate(record.applyTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">查看</Button>
              <Button v-if="queryType === 'todo'" type="link" size="small">审核</Button>
              <Button v-if="queryType === 'initiate' || queryType === 'my-submit'" type="link" size="small">撤销</Button>
              <Button v-if="queryType === 'todo'" type="link" size="small">催办</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
