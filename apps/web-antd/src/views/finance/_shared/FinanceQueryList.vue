<script setup lang="ts">
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

import { financePaymentApi, financeReimbursementApi } from '#/api/core/finance';

import { fetchLegacyFinanceList } from './legacy-finance';

interface FinanceQueryListProps {
  detailQueryKey?: 'payment-bill-list' | 'reimbursement-detail';
  description: string;
  queryKey: 'payment-list' | 'reimbursement-list';
  title: string;
}

const props = defineProps<FinanceQueryListProps>();

const loading = ref(false);
const dataSource = ref<Record<string, unknown>[]>([]);
const detailColumns = ref<any[]>([]);
const detailDataSource = ref<Record<string, unknown>[]>([]);
const detailLoading = ref(false);
const detailOpen = ref(false);
const detailTitle = ref('');
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const searchParams = ref({
  billNo: '',
  keyword: '',
  status: undefined as string | undefined,
});

const columns = computed(() => {
  const baseColumns: any[] = [
    { title: '单据编号', dataIndex: 'billNo', key: 'billNo', width: 180 },
    { title: '标题', dataIndex: 'title', key: 'title' },
    { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 120 },
    { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
    { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
    { title: '时间', dataIndex: 'billTime', key: 'billTime', width: 170 },
  ];

  if (props.queryKey === 'reimbursement-list') {
    baseColumns.splice(
      3,
      0,
      {
        title: '报销类型',
        dataIndex: 'claimType',
        key: 'claimType',
        width: 140,
      },
      {
        title: '应付金额',
        dataIndex: 'payableAmount',
        key: 'payableAmount',
        width: 120,
      },
      { title: '流程节点', dataIndex: 'flowNode', key: 'flowNode', width: 140 },
    );
  }

  if (props.queryKey === 'payment-list') {
    baseColumns.splice(
      3,
      0,
      {
        title: '支付方式',
        dataIndex: 'paymentType',
        key: 'paymentType',
        width: 130,
      },
      {
        title: '关联类型',
        dataIndex: 'relationType',
        key: 'relationType',
        width: 130,
      },
      {
        title: '付款银行',
        dataIndex: 'payerBank',
        key: 'payerBank',
        width: 160,
      },
      {
        title: '付款账号',
        dataIndex: 'payerAccount',
        key: 'payerAccount',
        width: 180,
      },
    );
  }

  if (props.detailQueryKey) {
    baseColumns.push({
      title: '操作',
      dataIndex: 'action',
      key: 'action',
      width: 120,
    });
  }

  return baseColumns;
});

const formatDate = (value: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const formatMoney = (value: null | number) =>
  typeof value === 'number'
    ? value.toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    : '-';

const pickFirstValue = (item: Record<string, unknown>, keys: string[]) => {
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
};

const parseNumber = (item: Record<string, unknown>, keys: string[]) => {
  const rawValue = pickFirstValue(item, keys);
  if (!rawValue) {
    return null;
  }
  const parsed = Number.parseFloat(rawValue.replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const buildReimbursementDetailRows = (
  billNo: string,
  items: Record<string, unknown>[],
) => {
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
};

const buildPaymentDetailRows = (
  billNo: string,
  items: Record<string, unknown>[],
) => {
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
};

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
  } catch (error: any) {
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
    message.error(error?.message || '加载财务查询列表失败');
  } finally {
    loading.value = false;
  }
};

const openDetail = async (record: any) => {
  if (!props.detailQueryKey || !record?.billNo) {
    return;
  }

  try {
    detailLoading.value = true;
    detailOpen.value = true;
    detailTitle.value = `单据明细 - ${record.billNo}`;
    const response =
      props.detailQueryKey === 'payment-bill-list'
        ? await financePaymentApi.getDetail(`${record.billNo || ''}`)
        : await financeReimbursementApi.getDetail(`${record.billNo || ''}`);
    const items = Array.isArray(response?.items) ? response.items : [];
    if (props.detailQueryKey === 'payment-bill-list') {
      buildPaymentDetailRows(`${record.billNo || ''}`, items);
    } else {
      buildReimbursementDetailRows(`${record.billNo || ''}`, items);
    }
  } catch (error: any) {
    detailDataSource.value = [];
    detailColumns.value = [];
    message.error(error?.message || '加载单据明细失败');
  } finally {
    detailLoading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page :title="title" :description="description">
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.billNo"
            placeholder="单据编号"
            class="w-44"
            allow-clear
          />
          <Input
            v-model:value="searchParams.keyword"
            placeholder="标题/申请人关键词"
            class="w-52"
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
                searchParams.billNo = '';
                searchParams.keyword = '';
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
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 980 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              {{ formatMoney(record.amount) }}
            </template>
            <template v-if="column.key === 'payableAmount'">
              {{ formatMoney(record.payableAmount) }}
            </template>
            <template v-if="column.key === 'billTime'">
              {{ formatDate(record.billTime) }}
            </template>
            <template v-if="column.key === 'status'">
              <Tag
                :color="
                  record.status === '1'
                    ? 'success'
                    : record.status === '2'
                      ? 'error'
                      : 'processing'
                "
              >
                {{ record.status || '-' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openDetail(record)">
                查看明细
              </Button>
            </template>
          </template>
        </Table>

        <Modal
          v-model:open="detailOpen"
          :title="detailTitle"
          :footer="null"
          width="1100px"
          destroy-on-close
        >
          <Table
            :columns="detailColumns"
            :data-source="detailDataSource"
            :loading="detailLoading"
            row-key="__rowId"
            bordered
            size="small"
            :pagination="false"
            :scroll="{ x: 960 }"
          />
        </Modal>
      </Card>
    </div>
  </Page>
</template>
