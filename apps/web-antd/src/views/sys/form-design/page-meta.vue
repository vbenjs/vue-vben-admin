<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
  Descriptions,
  Empty,
  Form,
  Input,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { sysPageSchemaApi, sysTenantApi } from '#/api/core/sys-manage';

import { pilotTemplatePresets, templateRouteMap } from './page-schema-presets';

type PublishScope = 'template' | 'tenant';

const router = useRouter();

const statusOptions = [
  { label: '启用', value: '0' },
  { label: '停用', value: '1' },
];

const modeOptions = [
  { label: '草稿态', value: 'draft' },
  { label: '发布态', value: 'published' },
];

const columns = [
  { title: '页面编码', dataIndex: 'pageCode', key: 'pageCode', width: 220 },
  { title: '页面名称', dataIndex: 'pageName', key: 'pageName', width: 180 },
  {
    title: '当前版本',
    dataIndex: 'currentVersion',
    key: 'currentVersion',
    width: 120,
  },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '更新时间', dataIndex: 'updateTime', key: 'updateTime', width: 180 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 240 },
  { title: '操作', key: 'action', width: 560, fixed: 'right' as const },
];

const logColumns = [
  { title: '版本号', dataIndex: 'versionNo', key: 'versionNo', width: 90 },
  { title: '操作', dataIndex: 'actionType', key: 'actionType', width: 90 },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
  { title: '时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '备注', dataIndex: 'remark', key: 'remark' },
  { title: '操作', key: 'action', width: 160 },
];

const loading = ref(false);
const initLoading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const searchParams = ref<{ pageName: string; status?: string }>({
  pageName: '',
  status: undefined,
});

const tenantOptions = ref<any[]>([]);
const selectedTenantId = ref<number | undefined>();

const templateModalOpen = ref(false);
const templateSubmitting = ref(false);
const templateFormRef = ref();

const tenantModalOpen = ref(false);
const tenantSubmitting = ref(false);
const tenantLoading = ref(false);
const tenantFormRef = ref();
const tenantTargetRecord = ref<any>(null);

const logModalOpen = ref(false);
const logLoading = ref(false);
const logScope = ref<PublishScope>('template');
const logTargetRecord = ref<any>(null);
const logTenantId = ref<number | undefined>();
const logDataSource = ref<any[]>([]);
const logSnapshot = ref('{}');

const previewModalOpen = ref(false);
const previewLoading = ref(false);
const previewMode = ref<'draft' | 'published'>('published');
const previewTargetRecord = ref<any>(null);
const previewTenantId = ref<number | undefined>();
const previewRuntime = ref<any>(null);

const defaultTemplateForm = () => ({
  currentVersion: 0,
  pageCode: '',
  pageName: '',
  publishedSchemaJson: '{}',
  remark: '',
  schemaJson: '{}',
  status: '0',
  templateId: '',
});

const defaultTenantForm = () => ({
  currentVersion: 0,
  overrideId: '',
  pageCode: '',
  pageName: '',
  patchJson: '{}',
  publishedPatchJson: '{}',
  remark: '',
  status: '0',
  tenantId: undefined as number | undefined,
});

const templateFormState = ref(defaultTemplateForm());
const tenantFormState = ref(defaultTenantForm());

const selectedTenantLabel = computed(() => {
  const matched = tenantOptions.value.find(
    (item) => `${item.value}` === `${selectedTenantId.value || ''}`,
  );
  return matched?.label || '未选择';
});

const publishedCount = computed(
  () =>
    dataSource.value.filter((item) => Number(item.currentVersion || 0) > 0)
      .length,
);

const enabledCount = computed(
  () =>
    dataSource.value.filter((item) => `${item.status || '0'}` === '0').length,
);

const logTitle = computed(() =>
  logScope.value === 'template' ? '模板发布记录' : '租户覆盖发布记录',
);

const previewSchemaText = computed(() =>
  prettyJson(previewRuntime.value?.schema || {}),
);
const previewPolicyText = computed(() =>
  prettyJson(previewRuntime.value?.policy || {}),
);

const templatePublishedTag = computed(() =>
  Number(templateFormState.value.currentVersion || 0) > 0 ? '已发布' : '未发布',
);

const tenantPublishedTag = computed(() =>
  Number(tenantFormState.value.currentVersion || 0) > 0 ? '已发布' : '未发布',
);

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN') : '-';
}

function formatVersion(version?: number) {
  const numericVersion = Number(version || 0);
  return numericVersion > 0 ? `V${numericVersion}` : '未发布';
}

function formatScopeAction(actionType?: string) {
  if (actionType === 'rollback') {
    return '回滚';
  }
  return '发布';
}

function statusText(status?: string) {
  return `${status || '0'}` === '1' ? '停用' : '启用';
}

function statusColor(status?: string) {
  return `${status || '0'}` === '1' ? 'default' : 'success';
}

function prettyJson(value: any, fallback = '{}') {
  if (value === undefined || value === null || value === '') {
    return fallback;
  }

  if (typeof value === 'string') {
    const normalized = value.trim();
    if (!normalized) {
      return fallback;
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
    return fallback;
  }
}

function normalizeJsonDraft(value: string, label: string) {
  const normalized = `${value || ''}`.trim() || '{}';
  try {
    return JSON.stringify(JSON.parse(normalized), null, 2);
  } catch {
    throw new Error(`${label} 不是合法 JSON`);
  }
}

function getTenantDisplayName(tenantId?: number) {
  const matched = tenantOptions.value.find(
    (item) => `${item.value}` === `${tenantId || ''}`,
  );
  return matched?.label || `租户 ${tenantId || '-'}`;
}

function ensureTenantSelected(explicitTenantId?: number) {
  const tenantId =
    explicitTenantId ?? selectedTenantId.value ?? tenantOptions.value[0]?.value;
  if (tenantId === undefined || tenantId === null) {
    message.warning('请先维护账套并选择一个租户');
    return null;
  }
  selectedTenantId.value = Number(tenantId);
  return Number(tenantId);
}

async function fetchTenantOptions() {
  const response = await sysTenantApi
    .getList({ page: 1, pageSize: 500 })
    .catch(() => ({ items: [] }));
  const items = Array.isArray(response?.items) ? response.items : [];
  tenantOptions.value = items.map((item: any) => ({
    label: item.tenantName || `账套${item.tenantId}`,
    status: item.status || '0',
    value: Number(item.tenantId),
  }));

  if (selectedTenantId.value === undefined && tenantOptions.value.length > 0) {
    const preferredTenant =
      tenantOptions.value.find((item) => `${item.status}` === '0') ||
      tenantOptions.value[0];
    selectedTenantId.value = preferredTenant.value;
  }
}

async function fetchList(page = 1) {
  try {
    loading.value = true;
    const response = await sysPageSchemaApi.getTemplateList({
      page,
      pageSize: pagination.value.pageSize,
      pageName: searchParams.value.pageName,
      status: searchParams.value.status,
    });
    dataSource.value = Array.isArray(response?.items) ? response.items : [];
    pagination.value.current = page;
    pagination.value.total = Number(response?.total || 0);
  } finally {
    loading.value = false;
  }
}

function resetFilters() {
  searchParams.value = {
    pageName: '',
    status: undefined,
  };
  void fetchList(1);
}

async function initializePilotTemplates() {
  Modal.confirm({
    title: '初始化试点页面模板？',
    content: '只创建缺失模板，不覆盖已有页面方案。',
    okText: '初始化',
    cancelText: '取消',
    centered: true,
    onOk: async () => {
      initLoading.value = true;
      try {
        let createdCount = 0;
        let skippedCount = 0;

        for (const preset of pilotTemplatePresets) {
          const existsResponse = await sysPageSchemaApi.getTemplateList({
            page: 1,
            pageCode: preset.pageCode,
            pageSize: 20,
          });
          const exists = (existsResponse?.items || []).some(
            (item: any) => item.pageCode === preset.pageCode,
          );

          if (exists) {
            skippedCount += 1;
            continue;
          }

          await sysPageSchemaApi.createTemplate({
            pageCode: preset.pageCode,
            pageName: preset.pageName,
            remark: `试点初始化：${preset.routePath}`,
            schemaJson: prettyJson(preset.schema),
            status: '0',
          });
          createdCount += 1;
        }

        await fetchList(1);

        if (createdCount > 0) {
          message.success(
            `已初始化${createdCount}个试点页面，跳过${skippedCount}个已存在页面`,
          );
        } else {
          message.info('试点页面模板已全部存在，无需重复初始化');
        }
      } finally {
        initLoading.value = false;
      }
    },
  });
}

function applyPilotPreset() {
  const matchedPreset = pilotTemplatePresets.find(
    (item) => item.pageCode === templateFormState.value.pageCode,
  );
  if (!matchedPreset) {
    message.warning('当前页面编码没有对应的试点预设');
    return;
  }

  templateFormState.value.pageName =
    templateFormState.value.pageName || matchedPreset.pageName;
  templateFormState.value.schemaJson = prettyJson(matchedPreset.schema);
  message.success('已载入试点预设草稿');
}

function formatTemplateJson() {
  try {
    templateFormState.value.schemaJson = normalizeJsonDraft(
      templateFormState.value.schemaJson,
      '模板草稿 JSON',
    );
    message.success('模板草稿已格式化');
  } catch (error: any) {
    message.error(error?.message || '模板草稿 JSON 格式非法');
  }
}

function formatTenantJson() {
  try {
    tenantFormState.value.patchJson = normalizeJsonDraft(
      tenantFormState.value.patchJson,
      '租户覆盖 JSON',
    );
    message.success('租户覆盖已格式化');
  } catch (error: any) {
    message.error(error?.message || '租户覆盖 JSON 格式非法');
  }
}

async function openTemplateModal(record?: any) {
  if (record?.templateId) {
    const detail = await sysPageSchemaApi.getTemplateById(record.templateId);
    templateFormState.value = {
      currentVersion: Number(detail?.currentVersion || 0),
      pageCode: detail?.pageCode || '',
      pageName: detail?.pageName || '',
      publishedSchemaJson: prettyJson(detail?.publishedSchemaJson || {}),
      remark: detail?.remark || '',
      schemaJson: prettyJson(detail?.schemaJson || {}),
      status: detail?.status || '0',
      templateId: detail?.templateId || '',
    };
  } else {
    templateFormState.value = defaultTemplateForm();
  }

  templateModalOpen.value = true;
}

async function saveTemplate() {
  try {
    await templateFormRef.value?.validate();
    templateSubmitting.value = true;

    const payload = {
      pageCode: templateFormState.value.pageCode,
      pageName: templateFormState.value.pageName,
      remark: templateFormState.value.remark,
      schemaJson: normalizeJsonDraft(
        templateFormState.value.schemaJson,
        '模板草稿 JSON',
      ),
      status: templateFormState.value.status,
    };

    if (templateFormState.value.templateId) {
      await sysPageSchemaApi.updateTemplate(
        templateFormState.value.templateId,
        payload,
      );
      message.success('页面模板草稿更新成功');
    } else {
      await sysPageSchemaApi.createTemplate(payload);
      message.success('页面模板草稿新增成功');
    }

    templateModalOpen.value = false;
    await fetchList(pagination.value.current);
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    }
  } finally {
    templateSubmitting.value = false;
  }
}

async function publishTemplate(record: any) {
  Modal.confirm({
    title: `确认发布模板【${record.pageName}】？`,
    content: `发布后将生成 ${formatVersion(Number(record.currentVersion || 0) + 1)} 版本。`,
    okText: '发布',
    cancelText: '取消',
    centered: true,
    onOk: async () => {
      await sysPageSchemaApi.publishTemplate(record.templateId);
      message.success('页面模板发布成功');
      await fetchList(pagination.value.current);
    },
  });
}

async function handleDelete(templateId: string) {
  await sysPageSchemaApi.removeTemplate(templateId);
  message.success('页面模板删除成功');
  await fetchList(pagination.value.current);
}

function openPage(record: any) {
  const routePath = templateRouteMap[record.pageCode];
  if (!routePath) {
    message.warning('当前页面未配置业务路由映射');
    return;
  }

  const target = router.resolve(routePath).href;
  window.open(target, '_blank');
}

async function loadTenantOverride(record: any, tenantId: number) {
  try {
    tenantLoading.value = true;
    const detail = await sysPageSchemaApi.getTenantOverride(record.pageCode, {
      tenantId,
    });
    tenantFormState.value = {
      currentVersion: Number(detail?.currentVersion || 0),
      overrideId: detail?.overrideId || '',
      pageCode: record.pageCode,
      pageName: record.pageName,
      patchJson: prettyJson(detail?.patchJson || {}),
      publishedPatchJson: prettyJson(detail?.publishedPatchJson || {}),
      remark: detail?.remark || '',
      status: detail?.status || '0',
      tenantId,
    };
    selectedTenantId.value = tenantId;
  } finally {
    tenantLoading.value = false;
  }
}

async function openTenantModal(record: any) {
  const tenantId = ensureTenantSelected();
  if (tenantId === null) {
    return;
  }

  tenantTargetRecord.value = record;
  tenantModalOpen.value = true;
  await loadTenantOverride(record, tenantId);
}

async function handleTenantChange(tenantId: any) {
  if (!tenantTargetRecord.value) {
    return;
  }
  await loadTenantOverride(tenantTargetRecord.value, Number(tenantId || 0));
}

async function persistTenantOverride(showMessage = true) {
  await tenantFormRef.value?.validate();

  const tenantId = ensureTenantSelected(tenantFormState.value.tenantId);
  if (tenantId === null) {
    throw new Error('tenantId 不能为空');
  }

  const payload = {
    patchJson: normalizeJsonDraft(
      tenantFormState.value.patchJson,
      '租户覆盖 JSON',
    ),
    remark: tenantFormState.value.remark,
    status: tenantFormState.value.status,
    tenantId,
  };

  const saved = await sysPageSchemaApi.saveTenantOverride(
    tenantFormState.value.pageCode,
    payload,
  );

  tenantFormState.value = {
    ...tenantFormState.value,
    currentVersion: Number(saved?.currentVersion || 0),
    overrideId: saved?.overrideId || '',
    patchJson: prettyJson(saved?.patchJson || {}),
    publishedPatchJson: prettyJson(saved?.publishedPatchJson || {}),
    remark: saved?.remark || '',
    status: saved?.status || '0',
    tenantId,
  };

  if (showMessage) {
    message.success('租户覆盖草稿保存成功');
  }

  return saved;
}

async function saveTenantOverride() {
  try {
    tenantSubmitting.value = true;
    await persistTenantOverride(true);
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    }
  } finally {
    tenantSubmitting.value = false;
  }
}

async function publishTenantOverride() {
  try {
    tenantSubmitting.value = true;
    await persistTenantOverride(false);
    await sysPageSchemaApi.publishTenantOverride(
      tenantFormState.value.pageCode,
      {
        tenantId: tenantFormState.value.tenantId,
      },
    );
    message.success('租户覆盖发布成功');
    await loadTenantOverride(
      tenantTargetRecord.value,
      Number(tenantFormState.value.tenantId),
    );
  } catch (error: any) {
    if (error?.message) {
      message.error(error.message);
    }
  } finally {
    tenantSubmitting.value = false;
  }
}

async function fetchLogs() {
  if (!logTargetRecord.value) {
    return;
  }

  try {
    logLoading.value = true;
    if (logScope.value === 'template') {
      logDataSource.value =
        (await sysPageSchemaApi.getTemplateLogs(
          logTargetRecord.value.templateId,
        )) || [];
    } else {
      const tenantId = ensureTenantSelected(logTenantId.value);
      if (tenantId === null) {
        logDataSource.value = [];
        return;
      }
      logTenantId.value = tenantId;
      logDataSource.value =
        (await sysPageSchemaApi.getTenantLogs(logTargetRecord.value.pageCode, {
          tenantId,
        })) || [];
    }

    logSnapshot.value = prettyJson(logDataSource.value[0]?.snapshotJson || {});
  } finally {
    logLoading.value = false;
  }
}

async function openTemplateLogs(record: any) {
  logScope.value = 'template';
  logTargetRecord.value = record;
  logSnapshot.value = '{}';
  logModalOpen.value = true;
  await fetchLogs();
}

async function openTenantLogs(record: any) {
  const tenantId = ensureTenantSelected();
  if (tenantId === null) {
    return;
  }

  logScope.value = 'tenant';
  logTargetRecord.value = record;
  logTenantId.value = tenantId;
  logSnapshot.value = '{}';
  logModalOpen.value = true;
  await fetchLogs();
}

function viewLogSnapshot(record: any) {
  logSnapshot.value = prettyJson(record?.snapshotJson || {});
}

async function rollbackLog(record: any) {
  if (!logTargetRecord.value) {
    return;
  }

  Modal.confirm({
    title: `确认回滚到 ${formatVersion(record.versionNo)}？`,
    content:
      logScope.value === 'template'
        ? '回滚后会生成新的模板发布版本。'
        : '回滚后会生成新的租户覆盖发布版本。',
    okText: '回滚',
    cancelText: '取消',
    centered: true,
    onOk: async () => {
      await (logScope.value === 'template'
        ? sysPageSchemaApi.rollbackTemplate(
            logTargetRecord.value.templateId,
            record.logId,
          )
        : sysPageSchemaApi.rollbackTenantOverride(
            logTargetRecord.value.pageCode,
            record.logId,
            { tenantId: logTenantId.value },
          ));

      message.success(
        logScope.value === 'template' ? '模板回滚成功' : '租户覆盖回滚成功',
      );
      await fetchLogs();
      await fetchList(pagination.value.current);

      if (
        tenantModalOpen.value &&
        tenantTargetRecord.value?.pageCode === logTargetRecord.value.pageCode &&
        tenantFormState.value.tenantId === logTenantId.value
      ) {
        await loadTenantOverride(
          tenantTargetRecord.value,
          Number(tenantFormState.value.tenantId),
        );
      }
    },
  });
}

async function handleLogTenantChange(tenantId: any) {
  logTenantId.value = Number(tenantId || 0);
  await fetchLogs();
}

async function fetchRuntimePreview() {
  if (!previewTargetRecord.value) {
    return;
  }

  try {
    previewLoading.value = true;
    const params: Record<string, any> = {
      mode: previewMode.value,
    };
    if (previewTenantId.value !== undefined && previewTenantId.value !== null) {
      params.tenantId = previewTenantId.value;
    }

    previewRuntime.value = await sysPageSchemaApi.getRuntime(
      previewTargetRecord.value.pageCode,
      params,
    );
  } finally {
    previewLoading.value = false;
  }
}

async function openPreview(record: any) {
  previewTargetRecord.value = record;
  previewMode.value = 'published';
  previewTenantId.value = selectedTenantId.value;
  previewRuntime.value = null;
  previewModalOpen.value = true;
  await fetchRuntimePreview();
}

async function refreshPreviewByTenant(tenantId?: any) {
  previewTenantId.value =
    tenantId === undefined || tenantId === null || tenantId === ''
      ? undefined
      : Number(tenantId);
  await fetchRuntimePreview();
}

onMounted(async () => {
  await Promise.all([fetchTenantOptions(), fetchList(1)]);
});
</script>

<template>
  <Page
    title="页面自定义"
    description="统一管理平台标准模板、租户覆盖和运行态页面方案。"
  >
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.pageName"
            placeholder="页面名称"
            class="w-44"
            allow-clear
          />
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            class="w-32"
            :options="statusOptions"
            allow-clear
          />
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button :loading="initLoading" @click="initializePilotTemplates">
            初始化试点页面
          </Button>
          <Button type="primary" class="ml-auto" @click="openTemplateModal()">
            + 新建模板
          </Button>
        </div>

        <div
          class="mb-3 flex flex-wrap items-center gap-3 rounded bg-gray-50 px-3 py-2 text-sm text-gray-600"
        >
          <span>当前页 {{ dataSource.length }} 条</span>
          <span>启用 {{ enabledCount }} 条</span>
          <span>已发布 {{ publishedCount }} 条</span>
          <span>租户视角 {{ selectedTenantLabel }}</span>
          <Select
            v-model:value="selectedTenantId"
            class="w-52"
            :options="tenantOptions"
            allow-clear
            placeholder="请选择租户"
          />
          <Button
            type="link"
            size="small"
            class="!px-0"
            @click="fetchTenantOptions"
          >
            刷新租户
          </Button>
        </div>

        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          row-key="templateId"
          bordered
          size="middle"
          :scroll="{ x: 1800 }"
          @change="(pag) => fetchList(pag.current || 1)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'currentVersion'">
              <Tag
                :color="
                  Number(record.currentVersion || 0) > 0
                    ? 'processing'
                    : 'default'
                "
              >
                {{ formatVersion(record.currentVersion) }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="statusColor(record.status)">
                {{ statusText(record.status) }}
              </Tag>
            </template>
            <template v-if="column.key === 'updateTime'">
              {{ formatDate(record.updateTime) }}
            </template>
            <template v-if="column.key === 'remark'">
              {{ record.remark || '-' }}
            </template>
            <template v-if="column.key === 'action'">
              <Button
                type="link"
                size="small"
                @click="openTemplateModal(record)"
              >
                编辑模板
              </Button>
              <Button type="link" size="small" @click="publishTemplate(record)">
                发布
              </Button>
              <Button
                type="link"
                size="small"
                @click="openTemplateLogs(record)"
              >
                模板记录
              </Button>
              <Button type="link" size="small" @click="openTenantModal(record)">
                当前租户覆盖
              </Button>
              <Button type="link" size="small" @click="openTenantLogs(record)">
                租户记录
              </Button>
              <Button type="link" size="small" @click="openPreview(record)">
                运行预览
              </Button>
              <Button
                type="link"
                size="small"
                :disabled="!templateRouteMap[record.pageCode]"
                @click="openPage(record)"
              >
                打开页面
              </Button>
              <Popconfirm
                title="确定删除模板吗？删除后不会自动清理租户覆盖与发布日志。"
                @confirm="handleDelete(record.templateId)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>

      <Modal
        v-model:open="templateModalOpen"
        :title="templateFormState.templateId ? '编辑页面模板' : '新建页面模板'"
        width="1100px"
        destroy-on-close
      >
        <Form
          ref="templateFormRef"
          :model="templateFormState"
          layout="vertical"
          class="mt-2"
        >
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item
              label="页面编码"
              name="pageCode"
              :rules="[{ required: true, message: '请输入页面编码' }]"
            >
              <Input
                v-model:value="templateFormState.pageCode"
                :disabled="!!templateFormState.templateId"
                placeholder="如 finance.reimbursement.query"
              />
            </Form.Item>

            <Form.Item
              label="页面名称"
              name="pageName"
              :rules="[{ required: true, message: '请输入页面名称' }]"
            >
              <Input
                v-model:value="templateFormState.pageName"
                placeholder="请输入页面名称"
              />
            </Form.Item>

            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="templateFormState.status">
                <Radio value="0">启用</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="已发布版本">
              <div class="flex items-center gap-2 pt-2">
                <Tag
                  :color="
                    Number(templateFormState.currentVersion || 0) > 0
                      ? 'processing'
                      : 'default'
                  "
                >
                  {{ templatePublishedTag }}
                </Tag>
                <span class="text-gray-500">
                  {{ formatVersion(templateFormState.currentVersion) }}
                </span>
              </div>
            </Form.Item>
          </div>

          <div
            v-if="templateFormState.templateId"
            class="mb-4 text-xs text-gray-500"
          >
            页面编码创建后不建议修改，否则会影响租户覆盖、日志和运行态映射。
          </div>

          <Form.Item label="备注" name="remark">
            <Input.TextArea
              v-model:value="templateFormState.remark"
              :rows="2"
              placeholder="请输入模板说明"
            />
          </Form.Item>

          <Form.Item
            label="模板草稿 JSON"
            name="schemaJson"
            :rules="[{ required: true, message: '请输入模板草稿 JSON' }]"
          >
            <Input.TextArea
              v-model:value="templateFormState.schemaJson"
              :rows="16"
              class="font-mono"
              placeholder="请输入页面模板草稿 JSON"
            />
          </Form.Item>

          <Form.Item label="已发布快照">
            <Input.TextArea
              :value="templateFormState.publishedSchemaJson"
              :rows="10"
              class="font-mono"
              readonly
            />
          </Form.Item>
        </Form>

        <template #footer>
          <Button @click="applyPilotPreset">载入试点预设</Button>
          <Button @click="formatTemplateJson">格式化 JSON</Button>
          <Button @click="templateModalOpen = false">取消</Button>
          <Button
            type="primary"
            :loading="templateSubmitting"
            @click="saveTemplate"
          >
            保存草稿
          </Button>
        </template>
      </Modal>

      <Modal
        v-model:open="tenantModalOpen"
        :title="
          tenantTargetRecord
            ? `${tenantTargetRecord.pageName} - 租户覆盖`
            : '租户覆盖'
        "
        width="1100px"
        destroy-on-close
      >
        <Form
          ref="tenantFormRef"
          :model="tenantFormState"
          layout="vertical"
          class="mt-2"
        >
          <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Form.Item label="页面编码">
              <Input :value="tenantFormState.pageCode" readonly />
            </Form.Item>

            <Form.Item label="页面名称">
              <Input :value="tenantFormState.pageName" readonly />
            </Form.Item>

            <Form.Item
              label="租户"
              name="tenantId"
              :rules="[{ required: true, message: '请选择租户' }]"
            >
              <Select
                v-model:value="tenantFormState.tenantId"
                :options="tenantOptions"
                :loading="tenantLoading"
                placeholder="请选择租户"
                @change="handleTenantChange"
              />
            </Form.Item>

            <Form.Item label="已发布版本">
              <div class="flex items-center gap-2 pt-2">
                <Tag
                  :color="
                    Number(tenantFormState.currentVersion || 0) > 0
                      ? 'processing'
                      : 'default'
                  "
                >
                  {{ tenantPublishedTag }}
                </Tag>
                <span class="text-gray-500">
                  {{ formatVersion(tenantFormState.currentVersion) }}
                </span>
              </div>
            </Form.Item>

            <Form.Item label="状态" name="status">
              <Radio.Group v-model:value="tenantFormState.status">
                <Radio value="0">启用</Radio>
                <Radio value="1">停用</Radio>
              </Radio.Group>
            </Form.Item>
          </div>

          <Form.Item label="备注" name="remark">
            <Input.TextArea
              v-model:value="tenantFormState.remark"
              :rows="2"
              placeholder="请输入租户覆盖说明"
            />
          </Form.Item>

          <Form.Item
            label="租户覆盖 JSON"
            name="patchJson"
            :rules="[{ required: true, message: '请输入租户覆盖 JSON' }]"
          >
            <Input.TextArea
              v-model:value="tenantFormState.patchJson"
              :rows="16"
              class="font-mono"
              placeholder="请输入租户覆盖 JSON"
            />
          </Form.Item>

          <Form.Item label="已发布覆盖快照">
            <Input.TextArea
              :value="tenantFormState.publishedPatchJson"
              :rows="10"
              class="font-mono"
              readonly
            />
          </Form.Item>
        </Form>

        <template #footer>
          <Button @click="formatTenantJson">格式化 JSON</Button>
          <Button @click="tenantModalOpen = false">关闭</Button>
          <Button :loading="tenantSubmitting" @click="saveTenantOverride">
            保存草稿
          </Button>
          <Button
            type="primary"
            :loading="tenantSubmitting"
            @click="publishTenantOverride"
          >
            发布覆盖
          </Button>
        </template>
      </Modal>

      <Modal
        v-model:open="logModalOpen"
        :title="logTitle"
        width="1180px"
        destroy-on-close
      >
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <div class="text-sm text-gray-600">
            页面：{{ logTargetRecord?.pageName || '-' }}
          </div>
          <div class="text-sm text-gray-600">
            编码：{{ logTargetRecord?.pageCode || '-' }}
          </div>
          <template v-if="logScope === 'tenant'">
            <span class="text-sm text-gray-600">租户</span>
            <Select
              v-model:value="logTenantId"
              class="w-56"
              :options="tenantOptions"
              placeholder="请选择租户"
              @change="handleLogTenantChange"
            />
          </template>
        </div>

        <Table
          :columns="logColumns"
          :data-source="logDataSource"
          :loading="logLoading"
          row-key="logId"
          bordered
          size="middle"
          :pagination="false"
          :scroll="{ x: 1000 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'versionNo'">
              <Tag color="processing">{{
                formatVersion(record.versionNo)
              }}</Tag>
            </template>
            <template v-if="column.key === 'actionType'">
              {{ formatScopeAction(record.actionType) }}
            </template>
            <template v-if="column.key === 'createTime'">
              {{ formatDate(record.createTime) }}
            </template>
            <template v-if="column.key === 'remark'">
              {{ record.remark || '-' }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="viewLogSnapshot(record)">
                查看快照
              </Button>
              <Button
                type="link"
                size="small"
                danger
                @click="rollbackLog(record)"
              >
                回滚
              </Button>
            </template>
          </template>
        </Table>

        <div class="mt-4">
          <div class="mb-2 text-sm text-gray-600">快照内容</div>
          <Input.TextArea
            :value="logSnapshot"
            :rows="12"
            class="font-mono"
            readonly
          />
        </div>

        <template #footer>
          <Button @click="logModalOpen = false">关闭</Button>
        </template>
      </Modal>

      <Modal
        v-model:open="previewModalOpen"
        title="运行态预览"
        width="1180px"
        destroy-on-close
      >
        <div class="mb-4 flex flex-wrap items-center gap-3">
          <Radio.Group
            v-model:value="previewMode"
            :options="modeOptions"
            option-type="button"
            button-style="solid"
            @change="fetchRuntimePreview"
          />
          <span class="text-sm text-gray-600">租户视角</span>
          <Select
            v-model:value="previewTenantId"
            class="w-56"
            :options="tenantOptions"
            allow-clear
            placeholder="不带租户覆盖"
            @change="refreshPreviewByTenant"
          />
          <Button @click="fetchRuntimePreview">刷新</Button>
          <Button
            v-if="
              previewTargetRecord &&
              templateRouteMap[previewTargetRecord.pageCode]
            "
            @click="openPage(previewTargetRecord)"
          >
            打开页面
          </Button>
        </div>

        <div v-if="previewRuntime?.available" class="space-y-4">
          <Descriptions bordered :column="2" size="small">
            <Descriptions.Item label="页面编码">
              {{ previewRuntime.pageCode }}
            </Descriptions.Item>
            <Descriptions.Item label="页面名称">
              {{ previewRuntime.pageName || '-' }}
            </Descriptions.Item>
            <Descriptions.Item label="预览模式">
              {{ previewMode === 'draft' ? '草稿态' : '发布态' }}
            </Descriptions.Item>
            <Descriptions.Item label="租户">
              {{
                previewTenantId ? getTenantDisplayName(previewTenantId) : '无'
              }}
            </Descriptions.Item>
            <Descriptions.Item label="模板版本">
              {{ formatVersion(previewRuntime?.versions?.template) }}
            </Descriptions.Item>
            <Descriptions.Item label="租户版本">
              {{ formatVersion(previewRuntime?.versions?.tenant) }}
            </Descriptions.Item>
            <Descriptions.Item label="策略版本">
              {{ formatVersion(previewRuntime?.versions?.policy) }}
            </Descriptions.Item>
            <Descriptions.Item label="模板来源">
              {{ previewRuntime?.sources?.templateId || '-' }}
            </Descriptions.Item>
            <Descriptions.Item label="租户来源">
              {{ previewRuntime?.sources?.overrideId || '-' }}
            </Descriptions.Item>
            <Descriptions.Item label="策略来源">
              {{ previewRuntime?.sources?.policyId || '-' }}
            </Descriptions.Item>
          </Descriptions>

          <Input.TextArea
            :value="previewSchemaText"
            :rows="20"
            class="font-mono"
            readonly
          />

          <div class="mt-4">
            <div class="mb-2 text-sm text-gray-600">策略内容</div>
            <Input.TextArea
              :value="previewPolicyText"
              :rows="12"
              class="font-mono"
              readonly
            />
          </div>
        </div>

        <div v-else class="py-10">
          <Empty
            :description="
              previewLoading
                ? '正在加载运行态结果...'
                : '当前页面暂无运行态配置'
            "
          />
        </div>

        <template #footer>
          <Button @click="previewModalOpen = false">关闭</Button>
        </template>
      </Modal>
    </div>
  </Page>
</template>
