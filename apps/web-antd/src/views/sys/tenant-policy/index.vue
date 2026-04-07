<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import {
  Button,
  Card,
  Input,
  Select,
  Space,
  Table,
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
const logsLoading = ref(false);
const policySubmitting = ref(false);
const previewLoading = ref(false);
const tenantOptions = ref<TenantOption[]>([]);
const selectedSceneCode = ref('finance.reimbursement.query');
const selectedTenantId = ref<number>();
const previewMode = ref<'draft' | 'published'>('draft');
const policyJson = ref('{}');
const policyLogs = ref<any[]>([]);
const previewJson = ref('{}');
const currentVersion = ref(0);

const logColumns = [
  { title: '版本号', dataIndex: 'versionNo', key: 'versionNo', width: 90 },
  { title: '操作', dataIndex: 'actionType', key: 'actionType', width: 100 },
  { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '操作', key: 'action', width: 120 },
];

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
      mode: previewMode.value,
      tenantId: selectedTenantId.value,
    });
    previewJson.value = prettyJson(runtime || {});
  } finally {
    previewLoading.value = false;
  }
}

async function fetchLogs() {
  if (!selectedTenantId.value) {
    policyLogs.value = [];
    return;
  }

  logsLoading.value = true;
  try {
    const logs = await sysTenantPolicyApi.getLogs(selectedSceneCode.value, {
      policyType: 'pageRuntime',
      tenantId: selectedTenantId.value,
    });
    policyLogs.value = Array.isArray(logs) ? logs : [];
  } finally {
    logsLoading.value = false;
  }
}

async function refreshAll() {
  loading.value = true;
  try {
    await Promise.all([fetchPolicy(), fetchRuntimePreview(), fetchLogs()]);
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

async function handlePreviewModeChange(value: any) {
  previewMode.value = value === 'published' ? 'published' : 'draft';
  await fetchRuntimePreview();
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
    await refreshAll();
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

async function rollbackPolicy(record: any) {
  if (!selectedTenantId.value || !record?.logId) {
    return;
  }

  policySubmitting.value = true;
  try {
    await sysTenantPolicyApi.rollbackPolicy(selectedSceneCode.value, record.logId, {
      policyType: 'pageRuntime',
      tenantId: selectedTenantId.value,
    });
    message.success('租户策略已回滚');
    await refreshAll();
  } catch (error: any) {
    message.error(error?.message || '租户策略回滚失败');
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
        <Select
          :value="previewMode"
          class="w-40"
          :options="[
            { label: '草稿预览', value: 'draft' },
            { label: '发布预览', value: 'published' },
          ]"
          @change="handlePreviewModeChange"
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

      <Card title="版本日志" size="small" class="mt-4" :loading="logsLoading">
        <Table
          row-key="logId"
          :columns="logColumns"
          :data-source="policyLogs"
          :pagination="false"
          size="small"
        >
          <template #bodyCell="{ column, record }">
            <Button
              v-if="column.key === 'action'"
              size="small"
              :disabled="policySubmitting"
              @click="rollbackPolicy(record)"
            >
              回滚
            </Button>
          </template>
        </Table>
      </Card>
    </Card>
  </div>
</template>
