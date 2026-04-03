<script setup lang="ts">
import type { WorkflowCommandAction } from '../_shared/workbench-command';

import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Input,
  message,
  Modal,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { fetchLegacyWorkbenchList } from '../_shared/legacy-workbench';
import {
  fetchWorkflowHistory,
  runWorkflowCommand,
} from '../_shared/workbench-command';

interface FlowTaskListProps {
  title: string;
  description: string;
  queryType: 'cc' | 'done' | 'initiate' | 'my-submit' | 'todo';
}

const props = defineProps<FlowTaskListProps>();

const loading = ref(false);
const dataSource = ref<Record<string, unknown>[]>([]);
const detailOpen = ref(false);
const detailRecord = ref<null | Record<string, unknown>>(null);
const historyLoading = ref(false);
const historyItems = ref<Record<string, unknown>[]>([]);
const commandOpen = ref(false);
const commandLoading = ref(false);
const commandRecord = ref<null | Record<string, unknown>>(null);
const commandMode = ref<'approve' | 'remind' | 'withdraw'>('approve');
const auditDecision = ref<'approve' | 'reject'>('approve');
const commandOpinion = ref('');
const pagination = ref({ current: 1, pageSize: 30, total: 0 });
const searchParams = ref({
  keyword: '',
  flowNo: '',
  status: undefined as string | undefined,
});

const columns = [
  { title: '标题', dataIndex: 'title', key: 'title' },
  { title: '流程编号', dataIndex: 'flowNo', key: 'flowNo', width: 160 },
  { title: '审批状态', dataIndex: 'status', key: 'status', width: 100 },
  {
    title: '当前节点',
    dataIndex: 'currentNode',
    key: 'currentNode',
    width: 120,
  },
  { title: '申请人', dataIndex: 'applyUser', key: 'applyUser', width: 100 },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 160 },
  { title: '操作', key: 'action', width: 180 },
];

const detailColumns: any[] = [
  { title: '字段', dataIndex: 'field', key: 'field', width: 220 },
  { title: '值', dataIndex: 'value', key: 'value' },
];

const historyColumns: any[] = [
  {
    title: '动作',
    dataIndex: 'approvalAction',
    key: 'approvalAction',
    width: 100,
  },
  {
    title: '审批人',
    dataIndex: 'approverName',
    key: 'approverName',
    width: 120,
  },
  {
    title: '审批部门',
    dataIndex: 'approverDeptName',
    key: 'approverDeptName',
    width: 150,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const statusMap: Record<string, { color: string; text: string }> = {
  '0': { text: '审核中', color: 'processing' },
  '1': { text: '已通过', color: 'success' },
  '2': { text: '已拒绝', color: 'error' },
  '3': { text: '已撤回', color: 'default' },
};

const commandTitleMap: Record<string, string> = {
  approve: '审核处理',
  remind: '催办提醒',
  withdraw: '撤销申请',
};

const detailItems = computed(() => {
  const rawValue = detailRecord.value?.raw;
  const source =
    rawValue && typeof rawValue === 'object'
      ? (rawValue as Record<string, unknown>)
      : detailRecord.value || {};

  return Object.entries(source)
    .filter(([key]) => key !== 'raw')
    .map(([key, value], index) => ({
      field: key,
      id: `${key}-${index}`,
      value:
        value === undefined || value === null || `${value}` === ''
          ? '-'
          : `${value}`,
    }));
});

const formatDate = (value?: null | string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const commandModalTitle = computed(
  () => commandTitleMap[commandMode.value] || '流程操作',
);

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const response = await fetchLegacyWorkbenchList({
      flowNo: searchParams.value.flowNo,
      keyword: searchParams.value.keyword,
      page,
      pageSize: pagination.value.pageSize,
      queryType: props.queryType,
      status: searchParams.value.status,
    });
    dataSource.value = response.items;
    pagination.value.current = page;
    pagination.value.total = response.total;
  } catch (error: any) {
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
    message.error(error?.message || '加载流程工作台失败');
  } finally {
    loading.value = false;
  }
};

const loadHistory = async (record: Record<string, unknown>) => {
  try {
    historyLoading.value = true;
    const response = await fetchWorkflowHistory(record);
    historyItems.value = Array.isArray(response) ? response : [];
  } catch (error: any) {
    historyItems.value = [];
    message.error(error?.message || '加载流程历史失败');
  } finally {
    historyLoading.value = false;
  }
};

const openDetail = async (record: Record<string, unknown>) => {
  detailRecord.value = record;
  detailOpen.value = true;
  await loadHistory(record);
};

const openCommandModal = (
  mode: 'approve' | 'remind' | 'withdraw',
  record: Record<string, unknown>,
) => {
  commandMode.value = mode;
  commandRecord.value = record;
  commandOpen.value = true;
  commandOpinion.value = '';
  auditDecision.value = 'approve';
};

const submitCommand = async () => {
  if (!commandRecord.value) {
    return;
  }

  try {
    commandLoading.value = true;
    const action: WorkflowCommandAction =
      commandMode.value === 'approve' ? auditDecision.value : commandMode.value;
    await runWorkflowCommand(action, commandRecord.value, commandOpinion.value);
    message.success('流程操作成功');
    commandOpen.value = false;
    await fetchList(pagination.value.current);
    if (detailOpen.value && detailRecord.value) {
      await loadHistory(detailRecord.value);
    }
  } catch (error: any) {
    message.error(error?.message || '流程操作失败');
  } finally {
    commandLoading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page :title="props.title" :description="props.description">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.keyword"
            placeholder="标题"
            class="w-40"
            allow-clear
          />
          <Input
            v-model:value="searchParams.flowNo"
            placeholder="流程编号"
            class="w-40"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-28"
            allow-clear
          >
            <Select.Option value="0">审核中</Select.Option>
            <Select.Option value="1">已通过</Select.Option>
            <Select.Option value="2">已拒绝</Select.Option>
            <Select.Option value="3">已撤回</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.keyword = '';
                searchParams.flowNo = '';
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="(pag) => fetchList(pag.current)"
          row-key="flowId"
          bordered
          size="middle"
          :scroll="{ x: 1080 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'status'">
              <Tag :color="statusMap[record.status]?.color || 'default'">
                {{ statusMap[record.status]?.text || record.status }}
              </Tag>
            </template>
            <template v-if="column.key === 'applyTime'">
              {{ formatDate(record.applyTime as string) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openDetail(record)">
                查看
              </Button>
              <Button
                v-if="props.queryType === 'todo'"
                type="link"
                size="small"
                @click="openCommandModal('approve', record)"
              >
                审核
              </Button>
              <Button
                v-if="
                  props.queryType === 'initiate' ||
                  props.queryType === 'my-submit'
                "
                type="link"
                size="small"
                @click="openCommandModal('withdraw', record)"
              >
                撤销
              </Button>
              <Button
                v-if="props.queryType === 'todo'"
                type="link"
                size="small"
                @click="openCommandModal('remind', record)"
              >
                催办
              </Button>
            </template>
          </template>
        </Table>

        <Modal
          v-model:open="detailOpen"
          title="流程详情"
          :footer="null"
          width="1080px"
          destroy-on-close
        >
          <div class="space-y-4">
            <Table
              :columns="detailColumns"
              :data-source="detailItems"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
            />
            <Table
              :columns="historyColumns"
              :data-source="historyItems"
              :loading="historyLoading"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
            >
              <template #bodyCell="{ column, record }">
                <template v-if="column.key === 'approvalTime'">
                  {{ formatDate(record.approvalTime as string) }}
                </template>
              </template>
            </Table>
          </div>
        </Modal>

        <Modal
          v-model:open="commandOpen"
          :title="commandModalTitle"
          :confirm-loading="commandLoading"
          @ok="submitCommand"
          destroy-on-close
        >
          <div class="space-y-4 pt-2">
            <div v-if="commandMode === 'approve'">
              <div class="mb-2 text-sm text-gray-500">审核决定</div>
              <Select v-model:value="auditDecision" class="w-full">
                <Select.Option value="approve">审核通过</Select.Option>
                <Select.Option value="reject">审核驳回</Select.Option>
              </Select>
            </div>
            <div>
              <div class="mb-2 text-sm text-gray-500">处理意见</div>
              <Input.TextArea
                v-model:value="commandOpinion"
                :rows="4"
                placeholder="请输入处理意见（可选）"
              />
            </div>
          </div>
        </Modal>
      </Card>
    </div>
  </Page>
</template>
