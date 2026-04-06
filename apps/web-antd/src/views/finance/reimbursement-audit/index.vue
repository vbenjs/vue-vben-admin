<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Input, message, Modal, Select, Table, Tag } from 'ant-design-vue';

import { fetchLegacyWorkbenchList } from '../../sys/_shared/legacy-workbench';
import {
  fetchWorkflowHistory,
  runWorkflowCommand,
  type WorkflowCommandAction,
} from '../../sys/_shared/workbench-command';

import '../_shared/legacy-finance.scss';

type AuditBusinessTab = 'expense' | 'loan' | 'refund';
type AuditStatusTab = 'approved' | 'done' | 'my-todo';
type CommandMode = 'add-sign' | 'approve' | 'remind' | 'withdraw';

const businessTabs: Array<{ key: AuditBusinessTab; label: string }> = [
  { key: 'expense', label: '报账审核' },
  { key: 'loan', label: '借款审核' },
  { key: 'refund', label: '退款审核' },
];

const statusTabs: Array<{ key: AuditStatusTab; label: string }> = [
  { key: 'my-todo', label: '待办' },
  { key: 'done', label: '已办' },
  { key: 'approved', label: '办结' },
];

const statusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'processing', text: '审核中' },
  '1': { color: 'success', text: '已通过' },
  '2': { color: 'error', text: '已驳回' },
  '3': { color: 'default', text: '已撤回' },
};

const businessLabelMap: Record<AuditBusinessTab, string> = {
  expense: '报账审核',
  loan: '借款审核',
  refund: '退款审核',
};

const commandTitleMap: Record<CommandMode, string> = {
  'add-sign': '加签处理',
  approve: '审核处理',
  remind: '催办提醒',
  withdraw: '撤销申请',
};

const columns = [
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '流程编号', dataIndex: 'flowNo', key: 'flowNo', width: 170 },
  { title: '单据标题', dataIndex: 'applyTitle', key: 'applyTitle', width: 280 },
  { title: '当前环节', dataIndex: 'currentNode', key: 'currentNode', width: 140 },
  { title: '当前处理人', dataIndex: 'currentHandler', key: 'currentHandler', width: 130 },
  { title: '申请人', dataIndex: 'applyUser', key: 'applyUser', width: 120 },
  { title: '申请时间', dataIndex: 'applyTime', key: 'applyTime', width: 180 },
  { title: '操作', key: 'action', width: 180 },
];

const detailColumns = [
  { title: '字段', dataIndex: 'field', key: 'field', width: 220 },
  { title: '值', dataIndex: 'value', key: 'value' },
];

const historyColumns = [
  { title: '动作', dataIndex: 'approvalAction', key: 'approvalAction', width: 100 },
  { title: '审批人', dataIndex: 'approverName', key: 'approverName', width: 120 },
  { title: '审批部门', dataIndex: 'approverDeptName', key: 'approverDeptName', width: 160 },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const loading = ref(false);
const dataSource = ref<Record<string, any>[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const activeBusinessTab = ref<AuditBusinessTab>('expense');
const activeStatusTab = ref<AuditStatusTab>('my-todo');

const detailOpen = ref(false);
const detailRecord = ref<null | Record<string, any>>(null);
const historyLoading = ref(false);
const historyItems = ref<Record<string, any>[]>([]);

const commandOpen = ref(false);
const commandLoading = ref(false);
const commandRecord = ref<null | Record<string, any>>(null);
const commandMode = ref<CommandMode>('approve');
const auditDecision = ref<'approve' | 'reject'>('approve');
const commandOpinion = ref('');

const searchParams = ref({
  applicant: '',
  currentNode: '',
  flowNo: '',
  keyword: '',
  status: undefined as string | undefined,
});

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  type: 'radio' as const,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const displayedRows = computed(() =>
  dataSource.value.filter((item) => {
    if (searchParams.value.keyword && !`${item.applyTitle || ''}`.includes(searchParams.value.keyword)) {
      return false;
    }
    if (searchParams.value.applicant && !`${item.applyUser || ''}`.includes(searchParams.value.applicant)) {
      return false;
    }
    if (searchParams.value.currentNode && !`${item.currentNode || ''}`.includes(searchParams.value.currentNode)) {
      return false;
    }
    if (searchParams.value.status && `${item.status || ''}` !== searchParams.value.status) {
      return false;
    }
    return true;
  }),
);

const selectedRecord = computed(() =>
  displayedRows.value.find((item) => String(item.applyId) === String(selectedRowKeys.value[0] || '')),
);

const currentBusinessLabel = computed(() => businessLabelMap[activeBusinessTab.value]);
const currentStatusLabel = computed(
  () => statusTabs.find((item) => item.key === activeStatusTab.value)?.label || '',
);

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

const commandModalTitle = computed(
  () => commandTitleMap[commandMode.value] || '流程处理',
);

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN') : '-';
}

function resetSearch() {
  searchParams.value = {
    applicant: '',
    currentNode: '',
    flowNo: '',
    keyword: '',
    status: undefined,
  };
}

async function fetchList(page = 1) {
  try {
    loading.value = true;
    const response = await fetchLegacyWorkbenchList({
      businessCategory: activeBusinessTab.value,
      flowNo: searchParams.value.flowNo,
      keyword: searchParams.value.keyword,
      page,
      pageSize: pagination.value.pageSize,
      queryType: activeStatusTab.value,
      status: searchParams.value.status,
    });
    dataSource.value = Array.isArray(response.items) ? response.items : [];
    pagination.value.current = page;
    pagination.value.total = Number(response.total || 0);
    selectedRowKeys.value = [];
  } catch (error: any) {
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
    message.error(error?.message || '加载审核列表失败');
  } finally {
    loading.value = false;
  }
}

async function loadHistory(record: Record<string, any>) {
  try {
    historyLoading.value = true;
    historyItems.value = await fetchWorkflowHistory(record);
  } catch (error: any) {
    historyItems.value = [];
    message.error(error?.message || '加载审核历史失败');
  } finally {
    historyLoading.value = false;
  }
}

async function openDetail(record?: Record<string, any>) {
  const target = record || selectedRecord.value;
  if (!target) {
    return message.warning('请选择一条审核数据');
  }
  detailRecord.value = target;
  detailOpen.value = true;
  await loadHistory(target);
}

function openCommandModal(mode: CommandMode, record?: Record<string, any>) {
  const target = record || selectedRecord.value;
  if (!target) {
    return message.warning('请选择一条审核数据');
  }
  commandMode.value = mode;
  commandRecord.value = target;
  commandOpen.value = true;
  commandOpinion.value = '';
  auditDecision.value = 'approve';
}

async function submitCommand() {
  if (!commandRecord.value) {
    return;
  }

  try {
    commandLoading.value = true;
    const action: WorkflowCommandAction =
      commandMode.value === 'approve' ? auditDecision.value : commandMode.value;
    await runWorkflowCommand(action, commandRecord.value, commandOpinion.value);
    message.success('流程处理成功');
    commandOpen.value = false;
    await fetchList(pagination.value.current);
    if (detailOpen.value && detailRecord.value) {
      await loadHistory(detailRecord.value);
    }
  } catch (error: any) {
    message.error(error?.message || '流程处理失败');
  } finally {
    commandLoading.value = false;
  }
}

watch([activeBusinessTab, activeStatusTab], () => {
  void fetchList(1);
});

onMounted(() => {
  void fetchList();
});
</script>

<template>
  <Page class="legacy-finance-page" content-class="!overflow-hidden !px-1 !py-1" auto-content-height>
    <div class="legacy-finance-shell">
      <div class="legacy-finance-tabs">
        <button
          v-for="tab in businessTabs"
          :key="tab.key"
          type="button"
          class="legacy-finance-tab"
          :class="{ 'is-active': activeBusinessTab === tab.key }"
          @click="activeBusinessTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="legacy-finance-tabs">
        <button
          v-for="tab in statusTabs"
          :key="tab.key"
          type="button"
          class="legacy-finance-tab"
          :class="{ 'is-active': activeStatusTab === tab.key }"
          @click="activeStatusTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="legacy-finance-search">
        <div class="legacy-finance-search-fields">
          <Input
            v-model:value="searchParams.flowNo"
            placeholder="请输入流程编号"
            class="legacy-finance-search-input legacy-finance-search-input--wide"
          />
          <Input
            v-model:value="searchParams.keyword"
            placeholder="请输入单据标题"
            class="legacy-finance-search-input legacy-finance-search-input--xwide"
          />
          <Input
            v-model:value="searchParams.applicant"
            placeholder="请输入申请人"
            class="legacy-finance-search-input"
          />
          <Input
            v-model:value="searchParams.currentNode"
            placeholder="请输入当前环节"
            class="legacy-finance-search-input legacy-finance-search-input--wide"
          />
          <Select
            v-model:value="searchParams.status"
            allow-clear
            placeholder="请选择状态"
            class="legacy-finance-search-input"
          >
            <Select.Option value="0">审核中</Select.Option>
            <Select.Option value="1">已通过</Select.Option>
            <Select.Option value="2">已驳回</Select.Option>
            <Select.Option value="3">已撤回</Select.Option>
          </Select>
        </div>
        <div class="legacy-finance-search-actions">
          <Button type="primary" class="legacy-finance-button" @click="fetchList(1)">搜索</Button>
          <Button
            class="legacy-finance-button"
            @click="
              () => {
                resetSearch();
                fetchList(1);
              }
            "
          >
            重置
          </Button>
        </div>
      </div>

      <div class="legacy-finance-toolbar">
        <div class="legacy-finance-toolbar-actions">
          <Button class="legacy-finance-button" @click="openDetail()">查看</Button>
          <Button
            v-if="activeStatusTab === 'my-todo'"
            type="primary"
            class="legacy-finance-button"
            @click="openCommandModal('approve')"
          >
            审核
          </Button>
          <Button
            v-if="activeStatusTab === 'my-todo'"
            class="legacy-finance-button"
            @click="openCommandModal('remind')"
          >
            催办
          </Button>
          <Button class="legacy-finance-button" @click="openDetail()">审核历史</Button>
          <Button class="legacy-finance-button" @click="fetchList(pagination.current)">刷新</Button>
        </div>
      </div>

      <div class="legacy-finance-summary">
        <span>当前业务:</span>
        <strong>{{ currentBusinessLabel }}</strong>
        <span>状态:</span>
        <strong>{{ currentStatusLabel }}</strong>
        <span>本页记录:</span>
        <strong>{{ displayedRows.length }}</strong>
      </div>

      <div class="legacy-finance-panel">
        <section class="legacy-finance-table-panel">
          <Table
            class="legacy-finance-table"
            row-key="applyId"
            bordered
            size="middle"
            :columns="columns"
            :data-source="displayedRows"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :scroll="{ x: 1440 }"
            @change="(pag) => fetchList(pag.current)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag :color="statusMap[record.status]?.color || 'default'">
                  {{ statusMap[record.status]?.text || record.status || '-' }}
                </Tag>
              </template>
              <template v-if="column.key === 'applyTime'">
                {{ formatDate(record.applyTime) }}
              </template>
              <template v-if="column.key === 'action'">
                <Button type="link" size="small" @click="openDetail(record)">查看</Button>
                <Button
                  v-if="activeStatusTab === 'my-todo'"
                  type="link"
                  size="small"
                  @click="openCommandModal('approve', record)"
                >
                  审核
                </Button>
              </template>
            </template>
          </Table>
          <div class="legacy-finance-footer">
            <span>列表总数{{ pagination.total }}条</span>
          </div>
        </section>
      </div>
    </div>

    <Modal
      v-model:open="detailOpen"
      title="审核详情"
      width="1120px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :footer="null"
    >
      <div class="legacy-finance-subdialog-body">
        <Table
          class="legacy-finance-embedded-table"
          :columns="detailColumns"
          :data-source="detailItems"
          row-key="id"
          bordered
          size="small"
          :pagination="false"
        />
        <div class="h-3"></div>
        <Table
          class="legacy-finance-embedded-table"
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
              {{ formatDate(record.approvalTime) }}
            </template>
          </template>
        </Table>
      </div>
    </Modal>

    <Modal
      v-model:open="commandOpen"
      :title="commandModalTitle"
      width="640px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :confirm-loading="commandLoading"
      @ok="submitCommand"
    >
      <div class="legacy-finance-subdialog-body space-y-4 pt-2">
        <div v-if="commandMode === 'approve'">
          <div class="mb-2 text-sm text-slate-500">审核决定</div>
          <Select v-model:value="auditDecision" class="w-full">
            <Select.Option value="approve">审核通过</Select.Option>
            <Select.Option value="reject">审核驳回</Select.Option>
          </Select>
        </div>
        <div>
          <div class="mb-2 text-sm text-slate-500">处理意见</div>
          <Input.TextArea
            v-model:value="commandOpinion"
            :rows="4"
            placeholder="请输入处理意见"
          />
        </div>
      </div>
    </Modal>
  </Page>
</template>
