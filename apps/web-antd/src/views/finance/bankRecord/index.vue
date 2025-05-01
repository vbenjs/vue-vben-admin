<script lang="ts" setup>
import type { VxeGridProps } from '#/adapter/vxe-table';
import type { BankApi } from '#/api';

import { Page, ApiComponent } from '@vben/common-ui';
import { useVbenVxeGrid } from '#/adapter/vxe-table';
import { getBankAllApi, getBankRecordListApi } from '#/api';
import { reactive } from 'vue';
import { Select, RangePicker, Button } from 'ant-design-vue';
import dayjs, { Dayjs } from 'dayjs';

defineOptions({ name: `BankRecord` });

const form = reactive({
  bankId: undefined,
  dates: [dayjs().startOf('month'), dayjs().endOf('month')],
});
const gridOptions: VxeGridProps = {
  columns: [
    { field: 'id', title: '编码', width: 70, fixed: 'left' },
    { field: 'bankName', title: '银行名称', width: 200, fixed: 'left' },
    { field: 'bankId', title: '银行编码', width: 70 },
    { field: 'busTypeName', title: '业务类型', width: 120 },
    { field: 'orderNo', title: '交易单号', width: 220 },
    {
      field: 'amount',
      title: '交易金额',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    {
      field: 'balance',
      title: '余额',
      width: 120,
      align: 'right',
      headerAlign: 'center',
    },
    { field: 'createdAt', title: '交易时间', width: 145 },
  ],
  proxyConfig: {
    ajax: {
      query: async ({ page }) => {
        return await getBankRecordListApi({
          pageNum: page.currentPage,
          pageSize: page.pageSize,
          startDate: form.dates[0].format('YYYY-MM-DD'),
          endDate: form.dates[1].format('YYYY-MM-DD'),
          bankId: form.bankId,
        });
      },
    },
  },
};
const [Grid, gridApi] = useVbenVxeGrid({ gridOptions });
</script>
<template>
  <Page auto-content-height>
    <template #title>
      <div class="flex gap-2">
        <div class="flex w-[200px] items-center">
          <span class="mr-2">银行</span>
          <ApiComponent
            :component="Select"
            :api="getBankAllApi"
            v-model:value="form.bankId"
            labelField="name"
            valueField="id"
            class="flex-1"
            placeholder="请选择银行"
            allowClear
          />
          <!-- @change="gridApi.reload()" -->
        </div>
        <div class="flex w-[300px] items-center">
          <span class="mr-2">交易时间</span>
          <!-- @openChange="
                async (open) => {
                  if (!open) {
                    await gridApi.reload();
                  }
                }
              " -->
          <RangePicker
            v-model:value="form.dates"
            class="flex-1"
            :allow-clear="false"
          />
        </div>
        <Button type="primary" @click="gridApi.reload()">查询</Button>
      </div>
    </template>
    <Grid></Grid>
  </Page>
</template>
