<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Tag,
  Typography,
  message,
} from 'ant-design-vue';

import {
  sysPageSchemaApi,
  sysTenantApi,
  sysTenantPolicyApi,
} from '#/api/core/sys-manage';

type TenantOption = {
  label: string;
  value: number;
};

const sceneOptions = [
  { label: '报销单查询', value: 'finance.reimbursement.query' },
  { label: '收入结算单', value: 'finance.income-settlement' },
  { label: '发票夹', value: 'finance.invoice-folder' },
];

const loading = ref(false);
const policySubmitting = ref(false);
const previewLoading = ref(false);
const tenantOptions = ref<TenantOption[]>([]);
const selectedSceneCode = ref('finance.reimbursement.query');
const selectedTenantId = ref<number>();
const policyJson = ref('{}');
const previewJson = ref('{}');
const currentVersion = ref(0);

const selectedTenantLabel = computed(() => {
  const matched = tenantOptions.value.find(
    (item) => item.value === selectedTenantId.value,
  );
  return matched?.label || '未选择';
});

function prettyJson(value: any) {
  if (value === undefined || value === null || value === '') {
    return '{}';
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return '{}';
    }
    try {
      return JSON.stringify(JSON.parse(normalized), null, 2);
    } catch {
      return normalized;
    }
  }

  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return '{}';
  }
}

function normalizeTenantId(value: any) {
  if (value === undefined || value === null || `${value}`.trim() === '') {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

async function fetchTenants() {
  const response = await sysTenantApi.getList({ page: 1, pageSize: 200 });
  const items = Array.isArray(response?.items) ? response.items : [];
  tenantOptions.value = items.map((item: any) => ({
    label: item.tenantName || `账套${item.tenantId}`,
    value: Number(item.tenantId),
  }));
  selectedTenantId.value =
    selectedTenantId.value || tenantOptions.value[0]?.value;
}

async function fetchPolicy() {
  if (!selectedTenantId.value) {
    policyJson.value = '{}';
    currentVersion.value = 0;
    return;
  }

  const detail = await sysTenantPolicyApi.getPolicy(selectedSceneCode.value, {
    policyType: 'pageRuntime',
    tenantId: selectedTenantId.value,
  });
  currentVersion.value = Number(detail?.currentVersion || 0);
  policyJson.value = prettyJson(detail?.policyJson || {});
}

async function fetchRuntimePreview() {
  if (!selectedTenantId.value) {
    previewJson.value = '{}';
    return;
  }

  previewLoading.value = true;
  try {
    const runtime = await sysPageSchemaApi.getRuntime(selectedSceneCode.value, {
      tenantId: selectedTenantId.value,
    });
    previewJson.value = prettyJson(runtime || {});
  } finally {
    previewLoading.value = false;
  }
}

async function refreshAll() {
  loading.value = true;
  try {
    await Promise.all([fetchPolicy(), fetchRuntimePreview()]);
  } finally {
    loading.value = false;
  }
}

async function handleTenantChange(value: any) {
  selectedTenantId.value = normalizeTenantId(value);
  await refreshAll();
}

async function handleSceneChange(value: any) {
  selectedSceneCode.value = `${value || sceneOptions[0]?.value || ''}`;
  await refreshAll();
}

async function savePolicy() {
  if (!selectedTenantId.value) {
    message.warning('请先选择租户');
    return;
  }

  policySubmitting.value = true;
  try {
    await sysTenantPolicyApi.savePolicy(selectedSceneCode.value, {
      policyJson: JSON.parse(policyJson.value || '{}'),
      policyType: 'pageRuntime',
      tenantId: selectedTenantId.value,
    });
    message.success('租户策略草稿已保存');
    await fetchPolicy();
  } catch (error: any) {
    message.error(error?.message || '租户策略保存失败');
  } finally {
    policySubmitting.value = false;
  }
}

async function publishPolicy() {
  if (!selectedTenantId.value) {
    message.warning('请先选择租户');
    return;
  }

  policySubmitting.value = true;
  try {
    await sysTenantPolicyApi.publishPolicy(selectedSceneCode.value, {
      policyType: 'pageRuntime',
      tenantId: selectedTenantId.value,
    });
    message.success('租户策略已发布');
    await refreshAll();
  } catch (error: any) {
    message.error(error?.message || '租户策略发布失败');
  } finally {
    policySubmitting.value = false;
  }
}

onMounted(async () => {
  await fetchTenants();
  await refreshAll();
});
</script>

<template>
  <div class="p-4">
    <Card title="租户策略设置" :loading="loading" :bordered="false">
      <div class="mb-4 flex flex-wrap items-center gap-3">
        <Select
          :value="selectedTenantId"
          class="w-56"
          :options="tenantOptions"
          placeholder="请选择租户"
          @change="handleTenantChange"
        />
        <Select
          :value="selectedSceneCode"
          class="w-64"
          :options="sceneOptions"
          placeholder="请选择场景"
          @change="handleSceneChange"
        />
        <Button @click="refreshAll">刷新</Button>
        <Button :loading="policySubmitting" @click="savePolicy">保存草稿</Button>
        <Button type="primary" :loading="policySubmitting" @click="publishPolicy">
          发布策略
        </Button>
      </div>

      <Space class="mb-4" wrap>
        <Typography.Text>当前租户：{{ selectedTenantLabel }}</Typography.Text>
        <Tag color="processing">策略版本 V{{ currentVersion }}</Tag>
        <Typography.Text>场景：{{ selectedSceneCode }}</Typography.Text>
      </Space>

      <div class="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <Card title="策略草稿 JSON" size="small">
          <Input.TextArea
            v-model:value="policyJson"
            :rows="18"
            class="font-mono"
          />
        </Card>

        <Card title="运行态预览" size="small" :loading="previewLoading">
          <Input.TextArea
            :value="previewJson"
            :rows="18"
            class="font-mono"
            readonly
          />
        </Card>
      </div>
    </Card>
  </div>
</template>
