<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Button, Card, Input, message, Table, Tag } from 'ant-design-vue';

import { financeVoucherApi } from '#/api/core/finance';

const loading = ref(false);
const dataSource = ref<Record<string, unknown>[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const searchParams = ref({ indicatorCode: '', keyword: '' });

const columns = [
  {
    title: '指标编码',
    dataIndex: 'indicatorCode',
    key: 'indicatorCode',
    width: 150,
  },
  {
    title: '指标名称',
    dataIndex: 'indicatorName',
    key: 'indicatorName',
    width: 220,
  },
  {
    title: '凭证状态',
    dataIndex: 'voucherStatus',
    key: 'voucherStatus',
    width: 120,
  },
  {
    title: '凭证月',
    dataIndex: 'voucherMonth',
    key: 'voucherMonth',
    width: 100,
  },
  { title: '凭证号', dataIndex: 'voucherNo', key: 'voucherNo', width: 140 },
  {
    title: '年初金额',
    dataIndex: 'yearBeginAmount',
    key: 'yearBeginAmount',
    width: 120,
  },
  {
    title: '年度总额',
    dataIndex: 'yearTotalAmount',
    key: 'yearTotalAmount',
    width: 120,
  },
  {
    title: '支付金额',
    dataIndex: 'paymentAmount',
    key: 'paymentAmount',
    width: 120,
  },
  {
    title: '可用金额',
    dataIndex: 'availableAmount',
    key: 'availableAmount',
    width: 120,
  },
];

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

const normalizeAmount = (item: Record<string, unknown>, keys: string[]) => {
  const rawValue = pickFirstValue(item, keys);
  if (!rawValue) {
    return null;
  }
  const parsed = Number.parseFloat(rawValue.replaceAll(',', ''));
  return Number.isFinite(parsed) ? parsed : null;
};

const formatMoney = (value: null | number) =>
  typeof value === 'number'
    ? value.toLocaleString('zh-CN', {
        maximumFractionDigits: 2,
        minimumFractionDigits: 2,
      })
    : '-';

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const response = await financeVoucherApi.getList({
      indicatorCode: searchParams.value.indicatorCode,
      keyword: searchParams.value.keyword,
      page,
      pageSize: pagination.value.pageSize,
    });
    const items = Array.isArray(response?.items) ? response.items : [];
    dataSource.value = items.map(
      (item: Record<string, unknown>, index: number) => ({
        availableAmount: normalizeAmount(item, [
          'availableAmount',
          'kyAmt',
          'usableAmount',
        ]),
        id:
          pickFirstValue(item, ['id', 'indicatorCode']) ||
          `${page}-${index + 1}`,
        indicatorCode: pickFirstValue(item, [
          'indicatorCode',
          'indicator_code',
          'zbCode',
          'quotaCode',
        ]),
        indicatorName: pickFirstValue(item, [
          'indicatorName',
          'indicator_name',
          'zbName',
          'quotaName',
        ]),
        paymentAmount: normalizeAmount(item, [
          'paymentAmount',
          'payAmt',
          'paidAmount',
        ]),
        yearBeginAmount: normalizeAmount(item, ['yearBeginAmount']),
        yearTotalAmount: normalizeAmount(item, ['yearTotalAmount']),
        voucherMonth: pickFirstValue(item, ['voucherMonth', 'voucher_month']),
        voucherNo: pickFirstValue(item, ['voucherNo', 'voucher_no']),
        voucherStatus: pickFirstValue(item, [
          'voucherStatus',
          'voucher_status',
          'status',
        ]),
      }),
    );
    pagination.value.current = page;
    pagination.value.total = Number(response?.total || 0);
  } catch (error: any) {
    dataSource.value = [];
    pagination.value.current = page;
    pagination.value.total = 0;
    message.error(error?.message || '加载凭证关联查询失败');
  } finally {
    loading.value = false;
  }
};

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-3 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.indicatorCode"
            placeholder="指标编码"
            class="w-44"
            allow-clear
          />
          <Input
            v-model:value="searchParams.keyword"
            placeholder="指标名称/凭证号关键词"
            class="w-56"
            allow-clear
          />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.indicatorCode = '';
                searchParams.keyword = '';
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
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 980 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template
              v-if="
                column.key === 'yearBeginAmount' ||
                column.key === 'yearTotalAmount' ||
                column.key === 'paymentAmount' ||
                column.key === 'availableAmount'
              "
            >
              {{ formatMoney(record[column.key]) }}
            </template>
            <template v-if="column.key === 'voucherStatus'">
              <Tag :color="record.voucherStatus ? 'processing' : 'default'">
                {{ record.voucherStatus || '-' }}
              </Tag>
            </template>
          </template>
        </Table>
      </Card>
    </div>
  </Page>
</template>
