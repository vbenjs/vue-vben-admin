<script setup lang="ts">
import type { LegacyFinanceListItem } from './legacy-finance';

import { computed, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  DatePicker,
  Input,
  message,
  Modal,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { financePaymentApi, financeReimbursementApi } from '#/api/core/finance';
import {
  mergePageSchemaItems,
  resolvePageSchemaValue,
  resolveToolbarItem,
} from '#/composables/usePageSchema';
import { useRuntimePageConfig } from '#/composables/useRuntimePageConfig';

import { fetchWorkflowHistory } from '../../sys/_shared/workbench-command';
import { fetchLegacyFinanceList } from './legacy-finance';

import './legacy-finance.scss';

interface FinanceQueryListProps {
  detailQueryKey?: 'payment-bill-list' | 'reimbursement-detail';
  description: string;
  pageCode?: string;
  queryKey: 'payment-list' | 'reimbursement-list';
  title: string;
}

const props = defineProps<FinanceQueryListProps>();

const TABLE_LOCALE = { emptyText: '暂无数据' };
const REIMBURSEMENT_SCROLL_X = 1800;
const PAYMENT_SCROLL_X = 1540;

type FinanceSearchField = {
  key: string;
  label: string;
  order?: number;
  placeholder?: string;
  size?: 'normal' | 'wide' | 'xwide';
  visible?: boolean;
};

type FinanceToolbarItem = {
  key: string;
  label: string;
  order?: number;
  visible?: boolean;
};

type FinanceTableColumn = {
  dataIndex: string;
  key: string;
  label?: string;
  order?: number;
  title: string;
  visible?: boolean;
  width?: number;
};

const loading = ref(false);
const dataSource = ref<LegacyFinanceListItem[]>([]);
const detailColumns = ref<any[]>([]);
const detailDataSource = ref<Record<string, unknown>[]>([]);
const detailLoading = ref(false);
const detailOpen = ref(false);
const detailTitle = ref('');
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyItems = ref<Record<string, unknown>[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const {
  resolveActionPolicy,
  resolveFieldPolicy,
  runtime,
  schema: pageSchema,
} = useRuntimePageConfig(
  () => props.pageCode || '',
  {
    enabled: () => !!props.pageCode,
  },
);

const searchParams = ref({
  applicant: '',
  billNo: '',
  category: undefined as string | undefined,
  dateRange: undefined as [string, string] | undefined,
  keyword: '',
  status: undefined as string | undefined,
});

const historyColumns = [
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
    width: 160,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const pageTitle = computed(() => runtime.value?.pageName || props.title);
const pageDescription = computed(() => props.description);

const queryCategoryOptions = computed(() =>
  props.queryKey === 'reimbursement-list'
    ? [
        { label: '报销申请单', value: '报销申请单' },
        { label: '费用报销单（批量支付）', value: '费用报销单（批量支付）' },
        { label: '公务接待报销单', value: '公务接待报销单' },
        { label: '培训费报销单', value: '培训费报销单' },
        { label: '会议费报销单', value: '会议费报销单' },
        { label: '差旅费报销单', value: '差旅费报销单' },
        {
          label: '公务用车运行维护费报销单',
          value: '公务用车运行维护费报销单',
        },
        {
          label: '费用报销单（一般性费用）',
          value: '费用报销单（一般性费用）',
        },
        { label: '费用报销单（支付令）', value: '费用报销单（支付令）' },
      ]
    : [
        { label: '银行转账', value: '银行转账' },
        { label: '授权支付', value: '授权支付' },
        { label: '直接支付', value: '直接支付' },
        { label: '公务卡', value: '公务卡' },
      ],
);

const defaultSearchFields = computed<FinanceSearchField[]>(() =>
  props.queryKey === 'reimbursement-list'
    ? [
        {
          key: 'search.category',
          label: '报账类型',
          order: 10,
          placeholder: '请选择报账类型',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.dateRange',
          label: '业务日期',
          order: 20,
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.billNo',
          label: '报账单号',
          order: 30,
          placeholder: '请输入报账单号',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.applicant',
          label: '申请人',
          order: 40,
          placeholder: '请输入申请人',
          size: 'normal',
          visible: true,
        },
        {
          key: 'search.keyword',
          label: '事项内容',
          order: 50,
          placeholder: '请输入事项内容',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.status',
          label: '状态',
          order: 60,
          placeholder: '请选择状态',
          size: 'normal',
          visible: true,
        },
      ]
    : [
        {
          key: 'search.category',
          label: '支付方式',
          order: 10,
          placeholder: '请选择支付方式',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.dateRange',
          label: '业务日期',
          order: 20,
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.billNo',
          label: '支付单号',
          order: 30,
          placeholder: '请输入支付单号',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.applicant',
          label: '申请人',
          order: 40,
          placeholder: '请输入申请人',
          size: 'normal',
          visible: true,
        },
        {
          key: 'search.keyword',
          label: '事项内容',
          order: 50,
          placeholder: '请输入事项内容',
          size: 'wide',
          visible: true,
        },
        {
          key: 'search.status',
          label: '状态',
          order: 60,
          placeholder: '请选择状态',
          size: 'normal',
          visible: true,
        },
      ],
);

const searchFields = computed(() =>
  mergePageSchemaItems(
    defaultSearchFields.value,
    resolvePageSchemaValue(pageSchema.value, ['search'], []),
  ),
);

const toolbarItems = computed(() =>
  mergePageSchemaItems<FinanceToolbarItem>(
    [
      { key: 'toolbar.detail', label: '详情', order: 10, visible: true },
      {
        key: 'toolbar.history',
        label: '审核历史',
        order: 20,
        visible: true,
      },
      { key: 'toolbar.refresh', label: '刷新', order: 30, visible: true },
    ],
    resolvePageSchemaValue(pageSchema.value, ['toolbar'], []),
  ),
);

const detailToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.detail', '详情'),
);
const historyToolbar = computed(() =>
  {
    const base = resolveToolbarItem(
      toolbarItems.value,
      'toolbar.history',
      '审核历史',
    );
    const policy = resolveActionPolicy('toolbar.history');
    return {
      enabled: policy.enabled !== false,
      label: base.label,
      visible: base.visible && policy.visible !== false,
    };
  },
);
const refreshToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.refresh', '刷新'),
);

watch(
  () => resolveFieldPolicy('search.status').defaultValue,
  (value) => {
    if (value !== undefined && searchParams.value.status === undefined) {
      searchParams.value.status = String(value);
    }
  },
  { immediate: true },
);

const defaultColumns = computed<FinanceTableColumn[]>(() => {
  if (props.queryKey === 'reimbursement-list') {
    return [
      { title: '状态', dataIndex: 'status', key: 'table.status', width: 90 },
      {
        title: '单据号',
        dataIndex: 'billNo',
        key: 'table.billNo',
        width: 180,
      },
      {
        title: '单据类型',
        dataIndex: 'claimType',
        key: 'table.claimType',
        width: 190,
      },
      {
        title: '预算项目+子项目',
        dataIndex: 'projectSummary',
        key: 'table.projectSummary',
        width: 210,
      },
      { title: '资金用途', dataIndex: 'usage', key: 'table.usage', width: 220 },
      {
        title: '申请人',
        dataIndex: 'applicant',
        key: 'table.applicant',
        width: 120,
      },
      {
        title: '填报时间',
        dataIndex: 'billTime',
        key: 'table.billTime',
        width: 160,
      },
      {
        title: '申请金额(元)',
        dataIndex: 'amount',
        key: 'table.amount',
        width: 130,
      },
      {
        title: '流程节点',
        dataIndex: 'flowNode',
        key: 'table.flowNode',
        width: 130,
      },
      {
        title: '是否补录',
        dataIndex: 'isSupplement',
        key: 'table.isSupplement',
        width: 100,
      },
      {
        title: '创建时间',
        dataIndex: 'createTime',
        key: 'table.createTime',
        width: 180,
      },
      {
        title: '进度',
        dataIndex: 'progress',
        key: 'table.progress',
        width: 90,
      },
    ];
  }

  return [
    { title: '状态', dataIndex: 'status', key: 'table.status', width: 90 },
    { title: '单据号', dataIndex: 'billNo', key: 'table.billNo', width: 180 },
    { title: '标题', dataIndex: 'title', key: 'table.title', width: 220 },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      key: 'table.paymentType',
      width: 130,
    },
    {
      title: '关联类型',
      dataIndex: 'relationType',
      key: 'table.relationType',
      width: 130,
    },
    {
      title: '付款银行',
      dataIndex: 'payerBank',
      key: 'table.payerBank',
      width: 180,
    },
    {
      title: '付款账号',
      dataIndex: 'payerAccount',
      key: 'table.payerAccount',
      width: 200,
    },
    {
      title: '申请人',
      dataIndex: 'applicant',
      key: 'table.applicant',
      width: 120,
    },
    { title: '金额(元)', dataIndex: 'amount', key: 'table.amount', width: 130 },
    { title: '时间', dataIndex: 'billTime', key: 'table.billTime', width: 180 },
  ];
});

const columns = computed(() =>
  mergePageSchemaItems(
    defaultColumns.value,
    resolvePageSchemaValue(pageSchema.value, ['table', 'columns'], []),
  ).map((item) => ({
    ...item,
    key: item.dataIndex,
    title: item.label || item.title,
  })),
);

const tableScrollX = computed(() => {
  const totalWidth = columns.value.reduce(
    (sum, item) => sum + Number(item.width || 120),
    0,
  );
  const minWidth =
    props.queryKey === 'reimbursement-list'
      ? REIMBURSEMENT_SCROLL_X
      : PAYMENT_SCROLL_X;
  return Math.max(totalWidth + 80, minWidth);
});

function resolveSearchFieldClass(field: FinanceSearchField) {
  if (field.size === 'wide') {
    return 'legacy-finance-search-input legacy-finance-search-input--wide';
  }

  if (field.size === 'xwide') {
    return 'legacy-finance-search-input legacy-finance-search-input--xwide';
  }

  return 'legacy-finance-search-input';
}

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys.slice(0, 1);
  },
}));

const selectedRecord = computed(() =>
  displayedRows.value.find(
    (item) => String(item.id) === String(selectedRowKeys.value[0] || ''),
  ),
);

const displayedRows = computed(() =>
  dataSource.value
    .map((item) => mapDisplayItem(item))
    .filter((item) => {
      if (
        searchParams.value.billNo &&
        !`${item.billNo || ''}`.includes(searchParams.value.billNo)
      ) {
        return false;
      }

      if (
        searchParams.value.applicant &&
        !`${item.applicant || ''}`.includes(searchParams.value.applicant)
      ) {
        return false;
      }

      if (
        searchParams.value.status &&
        `${item.status || ''}` !== searchParams.value.status
      ) {
        return false;
      }

      if (searchParams.value.category) {
        if (props.queryKey === 'reimbursement-list') {
          if (`${item.claimType || ''}` !== searchParams.value.category) {
            return false;
          }
        } else if (
          `${item.paymentType || ''}` !== searchParams.value.category
        ) {
          return false;
        }
      }

      if (searchParams.value.keyword) {
        const keyword = searchParams.value.keyword.toLowerCase();
        const haystack = [
          item.title,
          item.usage,
          item.projectSummary,
          item.billNo,
          item.applicant,
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(keyword)) {
          return false;
        }
      }

      if (searchParams.value.dateRange?.length === 2) {
        const [start, end] = searchParams.value.dateRange;
        const billDate = new Date(item.billTime || '').getTime();
        if (Number.isNaN(billDate)) {
          return false;
        }
        const startTime = new Date(`${start}T00:00:00`).getTime();
        const endTime = new Date(`${end}T23:59:59`).getTime();
        if (billDate < startTime || billDate > endTime) {
          return false;
        }
      }

      return true;
    }),
);

const totalAmount = computed(() =>
  displayedRows.value.reduce(
    (sum, item) => sum + (typeof item.amount === 'number' ? item.amount : 0),
    0,
  ),
);

function mapDisplayItem(item: LegacyFinanceListItem) {
  const raw =
    item.raw && typeof item.raw === 'object'
      ? (item.raw as Record<string, unknown>)
      : {};

  return {
    ...item,
    amount:
      typeof item.amount === 'number'
        ? item.amount
        : parseNumber(raw, ['amount', 'applyAmount', 'payAmount']),
    applicant:
      item.applicant || pickFirstValue(raw, ['applyUserName', 'applicant']),
    billNo: item.billNo,
    billTime: item.billTime || pickFirstValue(raw, ['fillTime', 'createTime']),
    claimType:
      item.claimType ||
      pickFirstValue(raw, ['claimType', 'billType', 'typeName']),
    createTime: pickFirstValue(raw, ['createTime', 'createdAt', 'billTime']),
    flowNo: pickFirstValue(raw, ['flowNo', 'billNo']) || item.billNo,
    flowNode: item.flowNode || pickFirstValue(raw, ['currentNode', 'flowNode']),
    isSupplement:
      pickFirstValue(raw, ['isSupplement', 'supplementFlag']) === '1'
        ? '是'
        : '否',
    paymentType: item.paymentType || pickFirstValue(raw, ['paymentType']),
    progress: pickFirstValue(raw, ['progress']) || '0%',
    projectSummary:
      pickFirstValue(raw, [
        'indicatorSummary',
        'indicatorName',
        'projectSummary',
        'projectName',
      ]) || item.title,
    relationType: item.relationType || pickFirstValue(raw, ['relationType']),
    status: normalizeStatusValue(item.status),
    title: item.title || pickFirstValue(raw, ['title', 'billTitle']),
    usage:
      pickFirstValue(raw, ['usage', 'fundUsage', 'content', 'remark']) ||
      item.title,
  };
}

function pickFirstValue(item: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = item[key];
    if (value === undefined || value === null) {
      continue;
    }
    const normalized = `${value}`.trim();
    if (normalized) {
      return normalized;
    }
  }
  return '';
}

function parseNumber(item: Record<string, unknown>, keys: string[]) {
  const rawValue = pickFirstValue(item, keys);
  if (!rawValue) {
    return null;
  }
  const parsed = Number.parseFloat(rawValue.replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeStatusValue(value: string) {
  if (['0', '1', '2', '3'].includes(`${value || ''}`)) {
    return `${value || ''}`;
  }

  if (`${value || ''}`.includes('通过')) {
    return '1';
  }
  if (`${value || ''}`.includes('驳回') || `${value || ''}`.includes('拒绝')) {
    return '2';
  }
  if (`${value || ''}`.includes('撤回')) {
    return '3';
  }
  return '0';
}

function formatDate(value: string) {
  return value ? new Date(value).toLocaleString('zh-CN') : '-';
}

function formatMoney(value: null | number) {
  return typeof value === 'number'
    ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '-';
}

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const response = await fetchLegacyFinanceList({
      billNo: searchParams.value.billNo,
      keyword: searchParams.value.keyword,
      page,
      pageSize: pagination.value.pageSize,
      queryKey: props.queryKey,
      status: searchParams.value.status,
    });
    dataSource.value = response.items;
    pagination.value.current = page;
    pagination.value.total = response.total;
    selectedRowKeys.value = [];
  } catch (error: any) {
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
    message.error(error?.message || '加载财务查询列表失败');
  } finally {
    loading.value = false;
  }
};

function resetFilters() {
  searchParams.value = {
    applicant: '',
    billNo: '',
    category: undefined,
    dateRange: undefined,
    keyword: '',
    status: undefined,
  };
  void fetchList(1);
}

function resolveTargetRecord(record?: any) {
  const target = record || selectedRecord.value;
  if (!target) {
    message.warning('请选择一条单据数据');
    return null;
  }
  return target;
}

const openDetail = async (record?: any) => {
  const target = resolveTargetRecord(record);
  if (!target || !props.detailQueryKey || !target.billNo) {
    return;
  }

  try {
    detailLoading.value = true;
    detailOpen.value = true;
    detailTitle.value = `单据详情 - ${target.billNo}`;
    const response =
      props.detailQueryKey === 'payment-bill-list'
        ? await financePaymentApi.getDetail(`${target.billNo || ''}`)
        : await financeReimbursementApi.getDetail(`${target.billNo || ''}`);
    const items = Array.isArray(response?.items) ? response.items : [];
    if (props.detailQueryKey === 'payment-bill-list') {
      buildPaymentDetailRows(`${target.billNo || ''}`, items);
    } else {
      buildReimbursementDetailRows(`${target.billNo || ''}`, items);
    }
  } catch (error: any) {
    detailDataSource.value = [];
    detailColumns.value = [];
    message.error(error?.message || '加载单据明细失败');
  } finally {
    detailLoading.value = false;
  }
};

async function openHistory(record?: any) {
  const target = resolveTargetRecord(record);
  if (!target) {
    return;
  }

  try {
    historyLoading.value = true;
    historyOpen.value = true;
    historyItems.value = await fetchWorkflowHistory({
      ...target,
      applyId: target.id,
      flowNo:
        pickFirstValue(target.raw || {}, ['flowNo', 'businessNo']) ||
        target.billNo,
    });
  } catch (error: any) {
    historyItems.value = [];
    message.error(error?.message || '加载审核历史失败');
  } finally {
    historyLoading.value = false;
  }
}

function buildReimbursementDetailRows(
  billNo: string,
  items: Record<string, unknown>[],
) {
  detailColumns.value = [
    { title: '用途', dataIndex: 'usage', key: 'usage', width: 220 },
    {
      title: '指标名称',
      dataIndex: 'indicatorName',
      key: 'indicatorName',
      width: 180,
    },
    {
      title: '经济分类',
      dataIndex: 'econCategory',
      key: 'econCategory',
      width: 160,
    },
    {
      title: '剩余额度',
      dataIndex: 'remainAmount',
      key: 'remainAmount',
      width: 120,
    },
    {
      title: '申请金额',
      dataIndex: 'applyAmount',
      key: 'applyAmount',
      width: 120,
    },
    { title: '小计', dataIndex: 'subtotal', key: 'subtotal', width: 120 },
    { title: '出发地', dataIndex: 'travelFrom', key: 'travelFrom', width: 140 },
    { title: '目的地', dataIndex: 'travelTo', key: 'travelTo', width: 140 },
    { title: '备注', dataIndex: 'remark', key: 'remark' },
  ];
  detailDataSource.value = items.map((item, index) => ({
    __rowId: `${billNo}-${index + 1}`,
    applyAmount: formatMoney(parseNumber(item, ['applyAmount'])),
    econCategory: pickFirstValue(item, ['econCategory']),
    indicatorName: pickFirstValue(item, ['indicatorName']),
    remainAmount: formatMoney(parseNumber(item, ['remainAmount'])),
    remark: pickFirstValue(item, ['remark']),
    subtotal: formatMoney(parseNumber(item, ['subtotal'])),
    travelFrom: pickFirstValue(item, ['travelFrom']),
    travelTo: pickFirstValue(item, ['travelTo']),
    usage: pickFirstValue(item, ['usage']),
  }));
}

function buildPaymentDetailRows(
  billNo: string,
  items: Record<string, unknown>[],
) {
  detailColumns.value = [
    { title: '收款人', dataIndex: 'payeeName', key: 'payeeName', width: 140 },
    { title: '收款类型', dataIndex: 'payeeType', key: 'payeeType', width: 120 },
    { title: '收款银行', dataIndex: 'payeeBank', key: 'payeeBank', width: 160 },
    {
      title: '收款账号',
      dataIndex: 'payeeAccount',
      key: 'payeeAccount',
      width: 180,
    },
    {
      title: '预算单位',
      dataIndex: 'payeeBudgetUnit',
      key: 'payeeBudgetUnit',
      width: 160,
    },
    { title: '付款人', dataIndex: 'payerName', key: 'payerName', width: 140 },
    { title: '付款银行', dataIndex: 'payerBank', key: 'payerBank', width: 160 },
    {
      title: '付款账号',
      dataIndex: 'payerAccount',
      key: 'payerAccount',
      width: 180,
    },
    { title: '付款单位', dataIndex: 'payerUnit', key: 'payerUnit', width: 160 },
    {
      title: '支付方式',
      dataIndex: 'paymentType',
      key: 'paymentType',
      width: 120,
    },
    {
      title: '关联类型',
      dataIndex: 'relationType',
      key: 'relationType',
      width: 120,
    },
  ];
  detailDataSource.value = items.map((item, index) => ({
    __rowId: `${billNo}-${index + 1}`,
    payeeAccount: pickFirstValue(item, ['payeeAccount']),
    payeeBank: pickFirstValue(item, ['payeeBank']),
    payeeBudgetUnit: pickFirstValue(item, ['payeeBudgetUnit']),
    payeeName: pickFirstValue(item, ['payeeName']),
    payeeType: pickFirstValue(item, ['payeeType']),
    payerAccount: pickFirstValue(item, ['payerAccount']),
    payerBank: pickFirstValue(item, ['payerBank']),
    payerName: pickFirstValue(item, ['payerName']),
    payerUnit: pickFirstValue(item, ['payerUnit']),
    paymentType: pickFirstValue(item, ['paymentType']),
    relationType: pickFirstValue(item, ['relationType']),
  }));
}

onMounted(() => {
  void fetchList();
});
</script>

<template>
  <Page
    :title="pageTitle"
    :description="pageDescription"
    class="legacy-finance-page"
    content-class="!overflow-hidden !px-1 !py-1"
    auto-content-height
  >
    <div class="legacy-finance-shell">
      <div class="legacy-finance-search">
        <div class="legacy-finance-search-fields">
          <template v-for="field in searchFields" :key="field.key">
            <Select
              v-if="field.key === 'search.category'"
              v-model:value="searchParams.category"
              allow-clear
              :placeholder="field.placeholder"
              :class="resolveSearchFieldClass(field)"
            >
              <Select.Option
                v-for="item in queryCategoryOptions"
                :key="item.value"
                :value="item.value"
              >
                {{ item.label }}
              </Select.Option>
            </Select>

            <DatePicker.RangePicker
              v-else-if="field.key === 'search.dateRange'"
              v-model:value="searchParams.dateRange"
              value-format="YYYY-MM-DD"
              :class="resolveSearchFieldClass(field)"
            />

            <Input
              v-else-if="field.key === 'search.billNo'"
              v-model:value="searchParams.billNo"
              :placeholder="field.placeholder"
              :class="resolveSearchFieldClass(field)"
            />

            <Input
              v-else-if="field.key === 'search.applicant'"
              v-model:value="searchParams.applicant"
              :placeholder="field.placeholder"
              :class="resolveSearchFieldClass(field)"
            />

            <Input
              v-else-if="field.key === 'search.keyword'"
              v-model:value="searchParams.keyword"
              :placeholder="field.placeholder"
              :class="resolveSearchFieldClass(field)"
            />

            <Select
              v-else-if="field.key === 'search.status'"
              v-model:value="searchParams.status"
              allow-clear
              :placeholder="field.placeholder"
              :class="resolveSearchFieldClass(field)"
            >
              <Select.Option value="0">审核中</Select.Option>
              <Select.Option value="1">已通过</Select.Option>
              <Select.Option value="2">已驳回</Select.Option>
              <Select.Option value="3">已撤回</Select.Option>
            </Select>
          </template>
        </div>

        <div class="legacy-finance-search-actions">
          <Button
            type="primary"
            class="legacy-finance-button"
            @click="fetchList(1)"
          >
            搜索
          </Button>
          <Button class="legacy-finance-button" @click="resetFilters"
            >重置</Button
          >
        </div>
      </div>

      <div class="legacy-finance-toolbar">
        <div class="legacy-finance-toolbar-actions">
          <Button
            v-if="detailToolbar.visible"
            class="legacy-finance-button"
            @click="openDetail()"
          >
            {{ detailToolbar.label }}
          </Button>
          <Button
            v-if="historyToolbar.visible"
            :disabled="historyToolbar.enabled === false"
            class="legacy-finance-button"
            @click="openHistory()"
          >
            {{ historyToolbar.label }}
          </Button>
          <Button
            v-if="refreshToolbar.visible"
            class="legacy-finance-button"
            @click="fetchList(pagination.current)"
          >
            {{ refreshToolbar.label }}
          </Button>
        </div>
      </div>

      <div class="legacy-finance-panel">
        <section class="legacy-finance-table-panel">
          <Table
            class="legacy-finance-table"
            row-key="id"
            bordered
            size="middle"
            :columns="columns"
            :data-source="displayedRows"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="TABLE_LOCALE"
            :scroll="{ x: tableScrollX }"
            @change="(pag) => fetchList(pag.current)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag
                  :color="
                    record.status === '1'
                      ? 'success'
                      : record.status === '2'
                        ? 'error'
                        : record.status === '3'
                          ? 'default'
                          : 'processing'
                  "
                >
                  {{
                    record.status === '1'
                      ? '已通过'
                      : record.status === '2'
                        ? '已驳回'
                        : record.status === '3'
                          ? '已撤回'
                          : '待送审'
                  }}
                </Tag>
              </template>

              <template v-if="['amount'].includes(String(column.key))">
                {{ formatMoney(record.amount) }}
              </template>

              <template
                v-if="
                  ['billTime', 'createTime', 'approvalTime'].includes(
                    String(column.key),
                  )
                "
              >
                {{ formatDate(record[String(column.key)]) }}
              </template>
            </template>
          </Table>

          <div class="legacy-finance-footer">
            <span>共{{ displayedRows.length }}条数据</span>
            <span
              >当前页金额合计
              <strong>{{ formatMoney(totalAmount) }}</strong></span
            >
          </div>
        </section>
      </div>
    </div>

    <Modal
      v-model:open="detailOpen"
      :title="detailTitle"
      width="1120px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :footer="null"
    >
      <div class="legacy-finance-subdialog-body">
        <Table
          class="legacy-finance-embedded-table"
          :columns="detailColumns"
          :data-source="detailDataSource"
          :loading="detailLoading"
          row-key="__rowId"
          bordered
          size="small"
          :pagination="false"
          :locale="TABLE_LOCALE"
          :scroll="{ x: 980 }"
        />
      </div>
    </Modal>

    <Modal
      v-model:open="historyOpen"
      title="审核历史"
      width="980px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :footer="null"
    >
      <div class="legacy-finance-subdialog-body">
        <Table
          class="legacy-finance-embedded-table"
          :columns="historyColumns"
          :data-source="historyItems"
          :loading="historyLoading"
          row-key="id"
          bordered
          size="small"
          :pagination="false"
          :locale="TABLE_LOCALE"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'approvalTime'">
              {{ formatDate(record.approvalTime) }}
            </template>
          </template>
        </Table>
      </div>
    </Modal>
  </Page>
</template>
