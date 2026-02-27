<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { Page } from '@vben/common-ui';
import { Card, Table, Button, Input, Select, Tag } from 'ant-design-vue';

// 通用审批列表列定义（我的审批 / 我的提交 / 待审流程 / 审批通过 / 抄送我的 / 全部审批）
interface ApprovalListPageProps {
  title: string;
  description: string;
  /** 数据过滤条件，留给后端接口按类型区分 */
  queryType: 'my-todo' | 'my-submit' | 'pending' | 'approved' | 'cc' | 'all';
}

const props = defineProps<ApprovalListPageProps>();

const loading = ref(false);
const dataSource = ref([]);
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({ keyword: '', status: undefined });

const columns = [
  { title: '流程名称', dataIndex: 'processName', key: 'processName' },
  { title: '申请标题', dataIndex: 'applyTitle', key: 'applyTitle' },
  { title: '申请人', dataIndex: 'applyUser', key: 'applyUser', width: 100 },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
  { title: '当前节点', dataIndex: 'currentNode', key: 'currentNode' },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '操作', key: 'action', width: 120 },
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
    // TODO: 接入真实审批工作台 API（根据 queryType 查询不同数据）
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
          <Input v-model:value="searchParams.keyword" placeholder="流程名称/申请标题" class="w-48" allowClear />
          <Select v-model:value="searchParams.status" placeholder="状态" class="w-28" allowClear>
            <Select.Option value="0">审核中</Select.Option>
            <Select.Option value="1">已通过</Select.Option>
            <Select.Option value="2">已拒绝</Select.Option>
            <Select.Option value="3">已撤回</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="() => { searchParams.keyword = ''; searchParams.status = undefined; fetchList(1); }">重置</Button>
        </div>

        <Table
          :columns="columns"
          :dataSource="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          rowKey="applyId"
          bordered
          size="middle"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="statusMap[record.status]?.color">
                {{ statusMap[record.status]?.text || record.status }}
              </Tag>
            </template>
            <template v-if="column.key === 'applyTime'">{{ formatDate(record.applyTime) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small">查看详情</Button>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
