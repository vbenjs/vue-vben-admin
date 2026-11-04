<script lang="ts" setup>
import type { IdempotentOrderResult } from '#/api/examples/idempotency';

import { ref } from 'vue';

import { Page } from '@vben/common-ui';

import { Alert, Button, Card, Space, Tag } from 'antdv-next';

import { submitIdempotentOrder } from '#/api/examples/idempotency';

type Scenario = 'auto' | 'fixed' | 'none';

interface RequestRecord extends IdempotentOrderResult {
  id: number;
  scenario: Scenario;
}

const scenarioLabels: Record<Scenario, string> = {
  auto: '自动生成',
  fixed: '业务固定键',
  none: '不带幂等键',
};

function createFormKey() {
  return `order-form-${Date.now()}`;
}

let recordSeq = 0;
const formKey = ref(createFormKey());
const loading = ref<null | Scenario>(null);
const records = ref<RequestRecord[]>([]);

async function submit(scenario: Scenario, times: number) {
  const idempotencyKey = {
    auto: undefined,
    fixed: formKey.value,
    none: false,
  }[scenario];
  loading.value = scenario;
  try {
    // 并发发出，模拟用户快速连续点击提交
    const results = await Promise.all(
      Array.from({ length: times }, () =>
        submitIdempotentOrder(idempotencyKey),
      ),
    );
    records.value = [
      ...results.map((result) => ({
        ...result,
        id: ++recordSeq,
        scenario,
      })),
      ...records.value,
    ];
  } finally {
    loading.value = null;
  }
}

function reopenForm() {
  formKey.value = createFormKey();
}
</script>
<template>
  <Page
    title="幂等请求（Idempotency-Key）"
    description="通过 idempotencyRequestInterceptor 为 POST/PUT/PATCH/DELETE 请求附加 Idempotency-Key 请求头。代码位置：playground/src/api/request.ts"
  >
    <Alert class="mb-4" type="info" show-icon>
      <template #title>
        mock 接口按 Idempotency-Key
        记录已创建的订单：同一个键的请求（包括并发请求）只会创建一个订单，后续请求返回第一次的结果并标记为重放。
        <br />
        自动生成的键每次调用都不同，只能保证同一次调用被重放（如 token
        刷新后重试）时不会重复下单；要拦截用户的重复点击，需要传入业务侧生成的固定键。
      </template>
    </Alert>

    <div class="grid grid-cols-1 gap-4 lg:grid-cols-3">
      <Card title="自动生成（默认）">
        <p class="mb-4 text-sm text-foreground/80">
          不传 idempotencyKey，拦截器为每次调用生成新键。连续提交 3 次会创建 3
          个订单。
        </p>
        <Button
          type="primary"
          :loading="loading === 'auto'"
          @click="submit('auto', 3)"
        >
          连续提交 3 次
        </Button>
      </Card>

      <Card title="业务固定键">
        <p class="mb-4 text-sm text-foreground/80">
          打开表单时生成键，之后每次提交都传入同一个键。连续提交 3 次只会创建 1
          个订单。
        </p>
        <p class="mb-4 font-mono text-xs break-all">当前键：{{ formKey }}</p>
        <Space wrap>
          <Button
            type="primary"
            :loading="loading === 'fixed'"
            @click="submit('fixed', 3)"
          >
            连续提交 3 次
          </Button>
          <Button @click="reopenForm">重新打开表单</Button>
        </Space>
      </Card>

      <Card title="不带幂等键">
        <p class="mb-4 text-sm text-foreground/80">
          传入 idempotencyKey: false，请求不附加请求头，服务端无法去重。连续提交
          3 次会创建 3 个订单。
        </p>
        <Button danger :loading="loading === 'none'" @click="submit('none', 3)">
          连续提交 3 次
        </Button>
      </Card>
    </div>

    <Card class="mt-4" title="请求记录">
      <template #extra>
        <Button size="small" @click="records = []">清空</Button>
      </template>
      <div v-if="records.length === 0" class="text-sm text-foreground/60">
        暂无请求
      </div>
      <div
        v-for="record in records"
        :key="record.id"
        class="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-border py-2 text-sm last:border-b-0"
      >
        <span class="w-24">{{ scenarioLabels[record.scenario] }}</span>
        <span class="w-24 font-mono">{{ record.orderId }}</span>
        <Tag :color="record.replayed ? 'warning' : 'success'">
          {{ record.replayed ? '重放' : '新建' }}
        </Tag>
        <span
          class="min-w-0 flex-1 truncate font-mono text-xs text-foreground/60"
        >
          Idempotency-Key：{{ record.idempotencyKey ?? '（无）' }}
        </span>
      </div>
    </Card>
  </Page>
</template>
