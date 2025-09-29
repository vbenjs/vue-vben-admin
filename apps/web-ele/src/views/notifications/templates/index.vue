<script lang="ts" setup>
import type { NotificationTemplateApi } from '#/api';

import { computed, onMounted, reactive, ref } from 'vue';

import { Page } from '@vben/common-ui';

import dayjs from 'dayjs';
import {
  ElButton,
  ElCard,
  ElDescriptions,
  ElDescriptionsItem,
  ElDialog,
  ElDrawer,
  ElMessage,
  ElMessageBox,
  ElPagination,
  ElTable,
  ElTableColumn,
  ElTag,
} from 'element-plus';

import { useVbenForm, z } from '#/adapter/form';
import {
  createNotificationTemplateApi,
  deleteNotificationTemplateApi,
  getNotificationTemplateDetailApi,
  listNotificationTemplatesApi,
  testSendNotificationTemplateApi,
  updateNotificationTemplateApi,
} from '#/api';
import { $t } from '#/locales';

defineOptions({ name: 'NotificationTemplateManagement' });

const t = $t;

const loading = ref(false);
const templates = ref<NotificationTemplateApi.TemplateRecord[]>([]);
const currentQuery = ref<NotificationTemplateApi.TemplateListParams>({});
const pagination = reactive({
  currentPage: 1,
  pageSize: 10,
});

const statusOptions = computed(() => [
  {
    label: t('page.notifications.templates.status.enabled'),
    value: '0',
    tagType: 'success' as const,
  },
  {
    label: t('page.notifications.templates.status.disabled'),
    value: '1',
    tagType: 'info' as const,
  },
]);

const typeOptions = computed(() => [
  {
    label: t('page.notifications.templates.type.system'),
    value: '0',
  },
  {
    label: t('page.notifications.templates.type.business'),
    value: '1',
  },
  {
    label: t('page.notifications.templates.type.marketing'),
    value: '2',
  },
]);

const priorityOptions = computed(() => [
  {
    label: t('page.notifications.templates.priority.high'),
    value: '0',
    tagType: 'danger' as const,
  },
  {
    label: t('page.notifications.templates.priority.medium'),
    value: '1',
    tagType: 'warning' as const,
  },
  {
    label: t('page.notifications.templates.priority.low'),
    value: '2',
    tagType: 'success' as const,
  },
]);

const total = computed(() => templates.value.length);
const pagedTemplates = computed(() => {
  const start = (pagination.currentPage - 1) * pagination.pageSize;
  return templates.value.slice(start, start + pagination.pageSize);
});

const dialogVisible = ref(false);
const isEdit = ref(false);
const currentTemplateId = ref<null | number>(null);
const detailDrawerVisible = ref(false);
const detailRecord = ref<NotificationTemplateApi.TemplateRecord | null>(null);

const testDialogVisible = ref(false);
const testLoading = ref(false);
const testResult = ref<NotificationTemplateApi.NotificationResponse | null>(
  null,
);
const testTemplateTitle = ref('');

const [QueryForm] = useVbenForm({
  collapsed: true,
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: handleQuerySubmit,
  handleReset: handleQueryReset,
  layout: 'horizontal',
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: t('page.notifications.templates.form.codePlaceholder'),
        clearable: true,
      },
      fieldName: 'templateCode',
      label: t('page.notifications.templates.form.code'),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t('page.notifications.templates.form.statusPlaceholder'),
        clearable: true,
        options: statusOptions,
      },
      fieldName: 'templateStatus',
      label: t('page.notifications.templates.form.status'),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t('page.notifications.templates.form.typePlaceholder'),
        clearable: true,
        options: typeOptions,
      },
      fieldName: 'notifiType',
      label: t('page.notifications.templates.form.type'),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t('page.notifications.templates.form.priorityPlaceholder'),
        clearable: true,
        options: priorityOptions,
      },
      fieldName: 'priority',
      label: t('page.notifications.templates.form.priority'),
    },
  ],
  showCollapseButton: true,
  submitButtonOptions: {
    content: t('common.query'),
  },
  resetButtonOptions: {
    content: t('common.reset'),
  },
  wrapperClass: 'grid-cols-1 md:grid-cols-2 xl:grid-cols-4',
});

const [TemplateForm, templateFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  handleSubmit: handleSave,
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      componentProps: {
        placeholder: t('page.notifications.templates.dialog.codePlaceholder'),
      },
      fieldName: 'templateCode',
      label: t('page.notifications.templates.dialog.code'),
      rules: z
        .string()
        .min(2, {
          message: t('page.notifications.templates.rules.codeMin'),
        })
        .max(64, {
          message: t('page.notifications.templates.rules.codeMax'),
        }),
    },
    {
      component: 'Input',
      componentProps: {
        placeholder: t('page.notifications.templates.dialog.titlePlaceholder'),
      },
      fieldName: 'templateTitle',
      label: t('page.notifications.templates.dialog.title'),
      rules: z
        .string()
        .min(2, {
          message: t('page.notifications.templates.rules.titleMin'),
        })
        .max(128, {
          message: t('page.notifications.templates.rules.titleMax'),
        }),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: t(
          'page.notifications.templates.dialog.contentPlaceholder',
        ),
      },
      fieldName: 'templateContent',
      label: t('page.notifications.templates.dialog.content'),
      rules: z.string().min(1, {
        message: t('page.notifications.templates.rules.contentRequired'),
      }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t('page.notifications.templates.dialog.typePlaceholder'),
        clearable: true,
        options: typeOptions,
      },
      fieldName: 'notifiType',
      label: t('page.notifications.templates.dialog.type'),
      rules: z.string().min(1, { message: '请选择通知类型' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t(
          'page.notifications.templates.dialog.priorityPlaceholder',
        ),
        clearable: true,
        options: priorityOptions,
      },
      fieldName: 'priority',
      label: t('page.notifications.templates.dialog.priority'),
      rules: z.string().min(1, { message: '请选择默认优先级' }),
    },
    {
      component: 'Select',
      componentProps: {
        placeholder: t('page.notifications.templates.dialog.statusPlaceholder'),
        options: statusOptions,
      },
      defaultValue: '0',
      fieldName: 'templateStatus',
      label: t('page.notifications.templates.dialog.status'),
      rules: z.string().min(0, {
        message: t('page.notifications.templates.rules.statusRequired'),
      }),
    },
    {
      component: 'Input',
      componentProps: {
        type: 'textarea',
        rows: 3,
        placeholder: t('page.notifications.templates.dialog.descPlaceholder'),
      },
      fieldName: 'tempDesc',
      label: t('page.notifications.templates.dialog.desc'),
      rules: z.string().max(256, {
        message: t('page.notifications.templates.rules.descMax'),
      }),
    },
  ],
  wrapperClass: 'grid-cols-1',
});

const [TestSendForm, testSendFormApi] = useVbenForm({
  commonConfig: {
    componentProps: {
      class: 'w-full',
    },
  },
  layout: 'vertical',
  showDefaultActions: false,
  schema: [
    {
      component: 'Input',
      fieldName: 'templateId',
      label: t('page.notifications.templates.testSend.form.templateId'),
      componentProps: {
        disabled: true,
      },
    },
    {
      component: 'Input',
      fieldName: 'userIds',
      label: t('page.notifications.templates.testSend.form.userIds'),
      componentProps: {
        placeholder: t(
          'page.notifications.templates.testSend.form.userIdsPlaceholder',
        ),
        clearable: true,
      },
      rules: z
        .string()
        .trim()
        .min(1, {
          message: t(
            'page.notifications.templates.testSend.rules.userIdsRequired',
          ),
        }),
    },
    {
      component: 'Input',
      fieldName: 'extraData',
      label: t('page.notifications.templates.testSend.form.extraData'),
      componentProps: {
        type: 'textarea',
        rows: 4,
        placeholder: t(
          'page.notifications.templates.testSend.form.extraDataPlaceholder',
        ),
      },
    },
  ],
  wrapperClass: 'grid-cols-1',
});

function formatDate(value?: string) {
  if (!value) return '';
  return dayjs(value).format('YYYY-MM-DD HH:mm:ss');
}

function sanitizeQuery(
  values: Record<string, unknown>,
): NotificationTemplateApi.TemplateListParams {
  const params: NotificationTemplateApi.TemplateListParams = {};
  Object.entries(values).forEach(([key, value]) => {
    if (typeof value === 'string' && value) {
      params[key as keyof NotificationTemplateApi.TemplateListParams] =
        value as never;
    }
  });
  return params;
}

async function fetchTemplateList(
  params: NotificationTemplateApi.TemplateListParams = currentQuery.value,
) {
  loading.value = true;
  try {
    const response = await listNotificationTemplatesApi(params);
    templates.value = Array.isArray(response) ? response : [];
  } catch (error) {
    console.error('Failed to load notification templates', error);
    ElMessage.error(t('page.notifications.templates.message.loadFailed'));
  } finally {
    loading.value = false;
  }
}

function handleQuerySubmit(values: Record<string, unknown>) {
  currentQuery.value = sanitizeQuery(values);
  pagination.currentPage = 1;
  fetchTemplateList(currentQuery.value);
}

function handleQueryReset() {
  currentQuery.value = {};
  pagination.currentPage = 1;
  fetchTemplateList({});
}

function handlePageChange(page: number) {
  pagination.currentPage = page;
}

function handleSizeChange(size: number) {
  pagination.pageSize = size;
  pagination.currentPage = 1;
}

function findOptionLabel(
  value: string | undefined,
  options:
    | Array<{ label: string; value: string }>
    | ReadonlyArray<{ label: string; value: string }>,
) {
  const fallback = t('page.notifications.templates.common.unknown');
  if (!value) return fallback;
  return options.find((item) => item.value === value)?.label ?? fallback;
}

function findStatusTagType(value: string | undefined) {
  if (!value) return 'info';
  return (
    statusOptions.value.find((item) => item.value === value)?.tagType || 'info'
  );
}

function findPriorityTagType(value: string | undefined) {
  if (!value) return 'info';
  return (
    priorityOptions.value.find((item) => item.value === value)?.tagType ||
    'info'
  );
}

function handleOpenTestSend(record: NotificationTemplateApi.TemplateRecord) {
  testDialogVisible.value = true;
  testResult.value = null;
  testTemplateTitle.value = record.templateTitle;
  testSendFormApi.resetForm();
  testSendFormApi.setValues({
    templateId: record.notifiTempId,
    userIds: '',
    extraData: '',
  });
}

function handleTestDialogClose() {
  testDialogVisible.value = false;
  testResult.value = null;
  testTemplateTitle.value = '';
  testLoading.value = false;
  testSendFormApi.resetForm();
}

async function handleTestSend() {
  const result = await testSendFormApi.validate();
  if (!result.valid) {
    ElMessage.warning(
      t('page.notifications.templates.testSend.message.validateFailed'),
    );
    return;
  }

  const values = await testSendFormApi.getValues();

  const rawIds = String(values.userIds || '')
    .split(',')
    .map((id) => id.trim())
    .filter(Boolean);

  if (rawIds.length === 0) {
    ElMessage.error(
      t('page.notifications.templates.testSend.message.userIdsInvalid'),
    );
    return;
  }

  const userIds = rawIds.map(Number).filter((id) => !Number.isNaN(id));

  if (userIds.length !== rawIds.length) {
    ElMessage.error(
      t('page.notifications.templates.testSend.message.userIdsInvalid'),
    );
    return;
  }

  const templateId = Number(values.templateId);
  if (!templateId || Number.isNaN(templateId)) {
    ElMessage.error(
      t('page.notifications.templates.testSend.message.templateIdInvalid'),
    );
    return;
  }

  let extraData: Record<string, unknown> | undefined;
  const extraInput =
    typeof values.extraData === 'string' ? values.extraData.trim() : '';
  if (extraInput) {
    try {
      extraData = JSON.parse(extraInput);
    } catch (error) {
      console.error('Invalid extraData payload for test send', error);
      ElMessage.error(
        t('page.notifications.templates.testSend.message.extraDataInvalid'),
      );
      return;
    }
  }

  testLoading.value = true;
  try {
    const response = await testSendNotificationTemplateApi({
      templateId,
      userIds,
      extraData,
    });
    testResult.value = response;
    ElMessage.success(
      t('page.notifications.templates.testSend.message.success'),
    );
  } catch (error) {
    console.error('Failed to test send notification template', error);
    ElMessage.error(t('page.notifications.templates.testSend.message.failed'));
  } finally {
    testLoading.value = false;
  }
}

function handleCreate() {
  isEdit.value = false;
  currentTemplateId.value = null;
  dialogVisible.value = true;
  templateFormApi.resetForm();
  templateFormApi.setValues({
    templateStatus: '0',
  });
}

async function handleEdit(record: NotificationTemplateApi.TemplateRecord) {
  try {
    const detail = await getNotificationTemplateDetailApi({
      notifiTempId: record.notifiTempId,
    });

    isEdit.value = true;
    currentTemplateId.value = detail.notifiTempId;
    dialogVisible.value = true;

    templateFormApi.resetForm();
    templateFormApi.setValues({
      templateCode: detail.templateCode,
      templateTitle: detail.templateTitle,
      templateContent: detail.templateContent,
      notifiType: detail.notifiType,
      priority: detail.priority,
      tempDesc: detail.tempDesc,
      templateStatus: detail.templateStatus,
    });
  } catch (error) {
    console.error('Failed to load template detail', error);
    ElMessage.error(t('page.notifications.templates.message.detailFailed'));
  }
}

async function handleSave() {
  const result = await templateFormApi.validate();
  if (!result.valid) {
    ElMessage.warning(t('page.notifications.templates.message.validateFailed'));
    return;
  }

  const values = await templateFormApi.getValues();

  try {
    if (isEdit.value && currentTemplateId.value) {
      await updateNotificationTemplateApi({
        notifiTempId: currentTemplateId.value,
        templateTitle: values.templateTitle,
        templateContent: values.templateContent,
        notifiType: values.notifiType,
        priority: values.priority,
        tempDesc: values.tempDesc,
        templateStatus: values.templateStatus,
      });
      ElMessage.success(
        t('page.notifications.templates.message.updateSuccess'),
      );
    } else {
      await createNotificationTemplateApi({
        templateCode: values.templateCode,
        templateTitle: values.templateTitle,
        templateContent: values.templateContent,
        notifiType: values.notifiType,
        priority: values.priority,
        tempDesc: values.tempDesc,
        templateStatus: values.templateStatus,
      });
      ElMessage.success(
        t('page.notifications.templates.message.createSuccess'),
      );
    }

    dialogVisible.value = false;
    fetchTemplateList(currentQuery.value);
  } catch (error) {
    console.error('Failed to save notification template', error);
    ElMessage.error(t('page.notifications.templates.message.saveFailed'));
  }
}

function handleDialogClose() {
  dialogVisible.value = false;
  isEdit.value = false;
  currentTemplateId.value = null;
  templateFormApi.resetForm();
}

async function handleView(record: NotificationTemplateApi.TemplateRecord) {
  try {
    const detail = await getNotificationTemplateDetailApi({
      notifiTempId: record.notifiTempId,
    });
    detailRecord.value = detail;
    detailDrawerVisible.value = true;
  } catch (error) {
    console.error('Failed to load template detail', error);
    ElMessage.error(t('page.notifications.templates.message.detailFailed'));
  }
}

function handleDrawerClose() {
  detailDrawerVisible.value = false;
  detailRecord.value = null;
}

async function handleDelete(record: NotificationTemplateApi.TemplateRecord) {
  try {
    await ElMessageBox.confirm(
      t('page.notifications.templates.message.deleteConfirm', {
        title: record.templateTitle,
      }),
      t('page.notifications.templates.message.deleteConfirmTitle'),
      {
        type: 'warning',
      },
    );

    await deleteNotificationTemplateApi({
      notifiTempId: record.notifiTempId,
    });
    ElMessage.success(t('page.notifications.templates.message.deleteSuccess'));
    fetchTemplateList(currentQuery.value);
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Failed to delete template', error);
      ElMessage.error(t('page.notifications.templates.message.deleteFailed'));
    }
  }
}

onMounted(() => {
  fetchTemplateList();
});
</script>

<template>
  <Page>
    <ElCard>
      <QueryForm />
    </ElCard>

    <ElCard class="mt-3 w-full">
      <div class="mb-4 flex items-center justify-between">
        <div>
          <h2 class="text-lg font-semibold">
            {{ t('page.notifications.templates.title') }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400">
            {{ t('page.notifications.templates.subtitle') }}
          </p>
        </div>
        <ElButton type="primary" @click="handleCreate">
          {{ t('page.notifications.templates.actions.create') }}
        </ElButton>
      </div>

      <ElTable
        v-loading="loading"
        :data="pagedTemplates"
        border
        stripe
        class="w-full"
      >
        <ElTableColumn
          :label="t('page.notifications.templates.table.code')"
          prop="templateCode"
          min-width="160"
          show-overflow-tooltip
        />
        <ElTableColumn
          :label="t('page.notifications.templates.table.title')"
          prop="templateTitle"
          min-width="180"
          show-overflow-tooltip
        />
        <ElTableColumn
          :label="t('page.notifications.templates.table.type')"
          min-width="140"
        >
          <template #default="{ row }">
            <ElTag type="info">
              {{ findOptionLabel(row.notifiType, typeOptions) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="t('page.notifications.templates.table.priority')"
          width="140"
        >
          <template #default="{ row }">
            <ElTag :type="findPriorityTagType(row.priority)">
              {{ findOptionLabel(row.priority, priorityOptions) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="t('page.notifications.templates.table.status')"
          width="140"
        >
          <template #default="{ row }">
            <ElTag :type="findStatusTagType(row.templateStatus)">
              {{ findOptionLabel(row.templateStatus, statusOptions) }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="t('page.notifications.templates.table.updatedTime')"
          width="180"
        >
          <template #default="{ row }">
            {{ formatDate(row.updatedTime) }}
          </template>
        </ElTableColumn>
        <ElTableColumn
          :label="t('page.notifications.templates.table.actions')"
          fixed="right"
          width="220"
        >
          <template #default="{ row }">
            <ElButton type="primary" link size="small" @click="handleView(row)">
              {{ t('page.notifications.templates.actions.view') }}
            </ElButton>
            <ElButton
              type="primary"
              link
              size="small"
              @click="handleOpenTestSend(row)"
            >
              {{ t('page.notifications.templates.actions.testSend') }}
            </ElButton>
            <ElButton type="primary" link size="small" @click="handleEdit(row)">
              {{ t('page.notifications.templates.actions.edit') }}
            </ElButton>
            <ElButton
              type="danger"
              link
              size="small"
              @click="handleDelete(row)"
            >
              {{ t('page.notifications.templates.actions.delete') }}
            </ElButton>
          </template>
        </ElTableColumn>
      </ElTable>

      <div class="mt-4 flex justify-end">
        <ElPagination
          v-model:current-page="pagination.currentPage"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="total"
          background
          layout="total, sizes, prev, pager, next, jumper"
          @current-change="handlePageChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ElCard>

    <ElDialog
      v-model="dialogVisible"
      :title="
        t(
          isEdit
            ? 'page.notifications.templates.dialog.editTitle'
            : 'page.notifications.templates.dialog.createTitle',
        )
      "
      width="640px"
      :close-on-click-modal="false"
      @closed="handleDialogClose"
    >
      <TemplateForm :disabled="{ templateCode: isEdit }" />

      <template #footer>
        <ElButton @click="handleDialogClose">
          {{ t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" @click="handleSave">
          {{ t('common.confirm') }}
        </ElButton>
      </template>
    </ElDialog>

    <ElDialog
      v-model="testDialogVisible"
      :title="
        t('page.notifications.templates.testSend.title', {
          title: testTemplateTitle || '-',
        })
      "
      width="560px"
      :close-on-click-modal="false"
      @closed="handleTestDialogClose"
    >
      <TestSendForm />

      <div v-if="testResult" class="mt-4">
        <ElCard shadow="never">
          <template #header>
            <span>{{
              t('page.notifications.templates.testSend.resultTitle')
            }}</span>
          </template>
          <pre class="whitespace-pre-wrap break-words text-xs leading-5">
            {{ JSON.stringify(testResult, null, 2) }}
          </pre>
        </ElCard>
      </div>

      <template #footer>
        <ElButton @click="handleTestDialogClose">
          {{ t('common.cancel') }}
        </ElButton>
        <ElButton type="primary" :loading="testLoading" @click="handleTestSend">
          {{ t('page.notifications.templates.testSend.actions.submit') }}
        </ElButton>
      </template>
    </ElDialog>

    <ElDrawer
      v-model="detailDrawerVisible"
      :title="t('page.notifications.templates.detail.title')"
      size="480px"
      @close="handleDrawerClose"
    >
      <ElDescriptions bordered :column="1" v-if="detailRecord">
        <ElDescriptionsItem
          :label="t('page.notifications.templates.table.code')"
        >
          {{ detailRecord.templateCode }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.table.title')"
        >
          {{ detailRecord.templateTitle }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.table.type')"
        >
          {{ findOptionLabel(detailRecord.notifiType, typeOptions) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.table.priority')"
        >
          {{ findOptionLabel(detailRecord.priority, priorityOptions) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.table.status')"
        >
          {{ findOptionLabel(detailRecord.templateStatus, statusOptions) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.detail.content')"
        >
          <pre class="whitespace-pre-wrap break-words">
            {{ detailRecord.templateContent }}
          </pre>
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.detail.desc')"
        >
          {{ detailRecord.tempDesc || t('common.emptyValue') }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.detail.updatedTime')"
        >
          {{ formatDate(detailRecord.updatedTime) }}
        </ElDescriptionsItem>
        <ElDescriptionsItem
          :label="t('page.notifications.templates.detail.createdTime')"
        >
          {{ formatDate(detailRecord.createdTime) }}
        </ElDescriptionsItem>
      </ElDescriptions>

      <template v-else>
        <p class="text-sm text-gray-500">
          {{ t('page.notifications.templates.detail.empty') }}
        </p>
      </template>
    </ElDrawer>
  </Page>
</template>
