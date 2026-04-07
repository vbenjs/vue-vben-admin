<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { invoiceFolderApi } from '#/api/core/finance';
import {
  mergePageSchemaItems,
  resolvePageSchemaValue,
  resolveToolbarItem,
} from '#/composables/usePageSchema';
import { useRuntimePageConfig } from '#/composables/useRuntimePageConfig';

import '../../finance/_shared/legacy-finance.scss';

const TABLE_LOCALE = { emptyText: '暂无数据' };
const DEFAULT_SCROLL_X = 1400;
const INFO_COLUMNS = [
  { title: '票据项', dataIndex: 'label', key: 'label', width: 110 },
  { title: '票据项值', dataIndex: 'value', key: 'value' },
];

type InvoiceFolderSearchField = {
  key: string;
  label: string;
  order?: number;
  placeholder?: string;
  size?: 'normal' | 'wide' | 'xwide';
  visible?: boolean;
};

type InvoiceFolderToolbarItem = {
  key: string;
  label: string;
  order?: number;
  visible?: boolean;
};

type InvoiceFolderColumn = {
  dataIndex: string;
  key: string;
  label?: string;
  order?: number;
  title: string;
  visible?: boolean;
  width?: number;
};

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const authOpen = ref(false);
const authTab = ref<'edit' | 'history'>('edit');
const authEntries = ref<any[]>([]);
const authHistoryEntries = ref<any[]>([]);
const {
  resolveActionPolicy,
  resolveFieldPolicy,
  runtime,
  schema: pageSchema,
} = useRuntimePageConfig('finance.invoice-folder');

const searchParams = ref({
  folderName: undefined as string | undefined,
  keyword: '',
});

const pageTitle = computed(() => runtime.value?.pageName || '发票夹');
const invoiceTypePolicy = computed(() =>
  resolveFieldPolicy('form.basic.invoiceType'),
);

const searchFields = computed(() =>
  mergePageSchemaItems<InvoiceFolderSearchField>(
    [
      {
        key: 'search.folderName',
        label: '发票夹',
        order: 10,
        placeholder: '全部',
        size: 'normal',
        visible: true,
      },
      {
        key: 'search.keyword',
        label: '关键字',
        order: 20,
        placeholder: '请输入搜索内容',
        size: 'wide',
        visible: true,
      },
    ],
    resolvePageSchemaValue(pageSchema.value, ['search'], []),
  ),
);

const toolbarItems = computed(() =>
  mergePageSchemaItems<InvoiceFolderToolbarItem>(
    [
      { key: 'toolbar.add', label: '新增发票', order: 10, visible: true },
      {
        key: 'toolbar.delete',
        label: '删除发票',
        order: 20,
        visible: true,
      },
      { key: 'toolbar.preview', label: '查看文件', order: 30, visible: true },
      {
        key: 'toolbar.restore',
        label: '发票还原',
        order: 40,
        visible: true,
      },
      {
        key: 'toolbar.reRecognize',
        label: '重新识别发票',
        order: 50,
        visible: true,
      },
      {
        key: 'toolbar.fixRecognize',
        label: '修改无法识别发票',
        order: 60,
        visible: true,
      },
      {
        key: 'toolbar.auth',
        label: '授权/取消授权',
        order: 70,
        visible: true,
      },
      {
        key: 'toolbar.authHistory',
        label: '授权记录',
        order: 80,
        visible: true,
      },
    ],
    resolvePageSchemaValue(pageSchema.value, ['toolbar'], []),
  ),
);

const addToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.add', '新增发票'),
);
const deleteToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.delete', '删除发票'),
);
const previewToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.preview', '查看文件'),
);
const restoreToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.restore', '发票还原'),
);
const reRecognizeToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.reRecognize', '重新识别发票'),
);
const fixRecognizeToolbar = computed(() =>
  resolveToolbarItem(
    toolbarItems.value,
    'toolbar.fixRecognize',
    '修改无法识别发票',
  ),
);
const authToolbar = computed(() =>
  {
    const base = resolveToolbarItem(
      toolbarItems.value,
      'toolbar.auth',
      '授权/取消授权',
    );
    const policy = resolveActionPolicy('toolbar.auth');
    return {
      label: base.label,
      visible: base.visible && policy.visible !== false,
    };
  },
);
const authHistoryToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.authHistory', '授权记录'),
);

const defaultForm = () => ({
  amount: 0,
  applicant: '',
  billNo: '',
  code: '',
  fileName: '',
  folderName: '默认发票夹',
  invoiceNo: '',
  invoiceType: '',
  remark: '',
  sourceType: '发票夹',
  status: '0',
  title: '',
  useStatus: '0',
  userName: '',
  verifierStatus: '0',
});

const formState = ref<any>(defaultForm());

function ensureInvoiceTypeDefault(target = formState.value) {
  if (target.invoiceType) {
    return;
  }
  target.invoiceType =
    invoiceTypePolicy.value.defaultValue !== undefined
      ? String(invoiceTypePolicy.value.defaultValue)
      : '增值税电子普通发票';
}

const columns = computed(() =>
  mergePageSchemaItems<InvoiceFolderColumn>(
    [
      {
        title: '来源',
        dataIndex: 'sourceType',
        key: 'table.sourceType',
        width: 100,
      },
      {
        title: '票据状态',
        dataIndex: 'useStatus',
        key: 'table.useStatus',
        width: 110,
      },
      {
        title: '票据类型',
        dataIndex: 'invoiceType',
        key: 'table.invoiceType',
        width: 170,
      },
      { title: '票据代码', dataIndex: 'code', key: 'table.code', width: 150 },
      {
        title: '发票号码',
        dataIndex: 'invoiceNo',
        key: 'table.invoiceNo',
        width: 190,
      },
      { title: '金额', dataIndex: 'amount', key: 'table.amount', width: 120 },
      {
        title: '提交人',
        dataIndex: 'userName',
        key: 'table.userName',
        width: 110,
      },
      {
        title: '识别状态',
        dataIndex: 'verifierStatus',
        key: 'table.verifierStatus',
        width: 110,
      },
      {
        title: '属性',
        dataIndex: 'property',
        key: 'table.property',
        width: 100,
      },
      {
        title: '上传时间',
        dataIndex: 'createTime',
        key: 'table.createTime',
        width: 180,
      },
    ],
    resolvePageSchemaValue(pageSchema.value, ['table', 'columns'], []),
  ).map((item) => ({
    ...item,
    key: item.dataIndex,
    title: item.label || item.title,
  })),
);

const tableScrollX = computed(() =>
  Math.max(
    columns.value.reduce((sum, item) => sum + Number(item.width || 120), 0) +
      80,
    DEFAULT_SCROLL_X,
  ),
);

const authColumns = [
  { title: '操作', key: 'action', width: 100 },
  { title: '授权方式', dataIndex: 'authMode', key: 'authMode', width: 160 },
  { title: '授权对象', dataIndex: 'authTarget', key: 'authTarget' },
];

const authHistoryColumns = [
  { title: '授权方式', dataIndex: 'authMode', key: 'authMode', width: 160 },
  { title: '授权对象', dataIndex: 'authTarget', key: 'authTarget', width: 180 },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
  {
    title: '授权时间',
    dataIndex: 'operateTime',
    key: 'operateTime',
    width: 180,
  },
  {
    title: '操作类型',
    dataIndex: 'operateType',
    key: 'operateType',
    width: 120,
  },
];

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  type: 'radio' as const,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const selectedRecord = computed(() =>
  dataSource.value.find(
    (item) => String(item.id) === String(selectedRowKeys.value[0] || ''),
  ),
);

function buildInfoRows(pairs: Array<[string, string]>) {
  return pairs.map(([label, value], index) => ({
    id: `${label}-${index}`,
    label,
    value: value || '-',
  }));
}

const detailRows = computed(() =>
  selectedRecord.value
    ? buildInfoRows([
        ['发票夹', `${selectedRecord.value.folderName || '-'}`],
        ['发票号码', `${selectedRecord.value.invoiceNo || '-'}`],
        ['发票代码', `${selectedRecord.value.code || '-'}`],
        ['发票类型', `${selectedRecord.value.invoiceType || '-'}`],
        ['金额', formatMoney(selectedRecord.value.amount)],
        ['来源', `${selectedRecord.value.sourceType || '-'}`],
      ])
    : [],
);

const detailItemRows = computed(() =>
  selectedRecord.value
    ? buildInfoRows([
        ['文件名称', `${selectedRecord.value.fileName || '-'}`],
        ['标题', `${selectedRecord.value.title || '-'}`],
        ['备注', `${selectedRecord.value.remark || '-'}`],
        ['申请人', `${selectedRecord.value.applicant || '-'}`],
      ])
    : [],
);

const detailVerifyRows = computed(() =>
  selectedRecord.value
    ? buildInfoRows([
        ['核验状态', verifierStatusLabel(selectedRecord.value.verifierStatus)],
        ['票据状态', useStatusLabel(selectedRecord.value.useStatus)],
      ])
    : [],
);

const detailUsageRows = computed(() =>
  selectedRecord.value
    ? buildInfoRows([
        ['关联单据编号', `${selectedRecord.value.billNo || '-'}`],
        ['使用人', `${selectedRecord.value.userName || '-'}`],
      ])
    : [],
);

function formatDate(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN') : '-';
}

function formatMoney(value?: number | string) {
  return value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toLocaleString('zh-CN', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
}

function useStatusLabel(status?: string) {
  if (status === '1') return '已关联';
  if (status === '2') return '已使用';
  return '未报销';
}

function verifierStatusLabel(status?: string) {
  if (status === '1') return '已核验';
  if (status === '2') return '核验异常';
  return '未核验';
}

async function fetchList(page = 1) {
  try {
    loading.value = true;
    const res = await invoiceFolderApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      folderName: searchParams.value.folderName,
      keyword: searchParams.value.keyword,
    });
    dataSource.value = Array.isArray(res?.items)
      ? res.items.map((item: any) => ({
          ...item,
          property: item.applicant ? '个人' : '单位',
          sourceType: item.sourceType || '发票夹',
        }))
      : [];
    pagination.value.current = page;
    pagination.value.total = Number(res?.total || 0);
    selectedRowKeys.value = dataSource.value[0]?.id
      ? [dataSource.value[0].id]
      : [];
  } finally {
    loading.value = false;
  }
}

async function openModal(record?: any) {
  formState.value = record?.id
    ? await invoiceFolderApi.getById(record.id)
    : defaultForm();
  ensureInvoiceTypeDefault(formState.value);
  isModalVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await invoiceFolderApi.update(formState.value.id, formState.value);
      message.success('更新发票成功');
    } else {
      await invoiceFolderApi.create(formState.value);
      message.success('新增发票成功');
    }
    isModalVisible.value = false;
    await fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await invoiceFolderApi.remove(id);
  message.success('删除发票成功');
  await fetchList(1);
}

async function deleteSelectedRecord() {
  if (!selectedRecord.value) {
    return message.warning('请选择一条发票数据');
  }
  await handleDelete(selectedRecord.value.id);
}

function resetFilters() {
  searchParams.value = {
    folderName: undefined,
    keyword: '',
  };
  void fetchList(1);
}

function showPlaceholder(label: string) {
  message.info(`${label}已按原系统保留入口，本轮先完成界面克隆。`);
}

function buildDefaultAuthRows(record: any) {
  const target = record?.applicant || '核算一部';
  return [
    {
      authMode: '部门',
      authTarget: target,
      id: 'auth-1',
      operateTime: formatDate(new Date().toISOString()),
      operateType: '新增',
      operatorName: record?.userName || '经办人',
    },
  ];
}

function openAuthModal(tab: 'edit' | 'history') {
  if (!selectedRecord.value) {
    return message.warning('请选择一条发票数据');
  }
  authTab.value = tab;
  authEntries.value = buildDefaultAuthRows(selectedRecord.value);
  authHistoryEntries.value = [
    ...buildDefaultAuthRows(selectedRecord.value),
    {
      authMode: '部门',
      authTarget: selectedRecord.value.userName || '核算一部',
      id: 'auth-2',
      operateTime: formatDate(selectedRecord.value.createTime),
      operateType: '修改',
      operatorName: selectedRecord.value.userName || '经办人',
    },
  ];
  authOpen.value = true;
}

function addAuthEntry() {
  authEntries.value = [
    ...authEntries.value,
    {
      authMode: '部门',
      authTarget: '',
      id: `auth-${authEntries.value.length + 1}`,
      operateTime: formatDate(new Date().toISOString()),
      operateType: '新增',
      operatorName: selectedRecord.value?.userName || '经办人',
    },
  ];
}

function removeAuthEntry(id: string) {
  authEntries.value = authEntries.value.filter((item) => item.id !== id);
}

function handleAuthOk() {
  message.success(
    authTab.value === 'history' ? '授权记录已确认' : '授权设置已保存',
  );
  authOpen.value = false;
}

watch(
  () => invoiceTypePolicy.value.defaultValue,
  () => {
    ensureInvoiceTypeDefault(formState.value);
  },
  { immediate: true },
);

onMounted(() => {
  void fetchList();
});
</script>

<template>
  <Page
    :title="pageTitle"
    class="legacy-finance-page"
    content-class="!overflow-hidden !px-1 !py-1"
    auto-content-height
  >
    <div class="legacy-finance-shell">
      <div class="legacy-finance-search">
        <div class="legacy-finance-search-fields">
          <template v-for="field in searchFields" :key="field.key">
            <Select
              v-if="field.key === 'search.folderName'"
              v-model:value="searchParams.folderName"
              allow-clear
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            >
              <Select.Option value="默认发票夹">默认发票夹</Select.Option>
              <Select.Option value="报销发票夹">报销发票夹</Select.Option>
              <Select.Option value="收入发票夹">收入发票夹</Select.Option>
            </Select>
            <Input
              v-else-if="field.key === 'search.keyword'"
              v-model:value="searchParams.keyword"
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            />
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
            v-if="addToolbar.visible"
            type="primary"
            class="legacy-finance-button"
            @click="openModal()"
          >
            {{ addToolbar.label }}
          </Button>
          <Popconfirm
            v-if="deleteToolbar.visible"
            title="确定删除选中数据吗？"
            @confirm="deleteSelectedRecord"
          >
            <Button
              class="legacy-finance-button legacy-finance-button--danger"
              >{{ deleteToolbar.label }}</Button
            >
          </Popconfirm>
          <Button
            v-if="previewToolbar.visible"
            class="legacy-finance-button"
            @click="showPlaceholder('查看文件')"
          >
            {{ previewToolbar.label }}
          </Button>
          <Button
            v-if="restoreToolbar.visible"
            class="legacy-finance-button"
            @click="showPlaceholder('发票还原')"
          >
            {{ restoreToolbar.label }}
          </Button>
          <Button
            v-if="reRecognizeToolbar.visible"
            class="legacy-finance-button"
            @click="showPlaceholder('重新识别发票')"
          >
            {{ reRecognizeToolbar.label }}
          </Button>
          <Button
            v-if="fixRecognizeToolbar.visible"
            class="legacy-finance-button"
            @click="showPlaceholder('修改无法识别发票')"
          >
            {{ fixRecognizeToolbar.label }}
          </Button>
          <Button
            v-if="authToolbar.visible"
            class="legacy-finance-button"
            @click="openAuthModal('edit')"
          >
            {{ authToolbar.label }}
          </Button>
          <Button
            v-if="authHistoryToolbar.visible"
            class="legacy-finance-button"
            @click="openAuthModal('history')"
          >
            {{ authHistoryToolbar.label }}
          </Button>
        </div>
      </div>

      <div class="legacy-finance-panel invoice-folder-layout">
        <section class="legacy-finance-table-panel invoice-folder-main">
          <Table
            class="legacy-finance-table"
            row-key="id"
            bordered
            size="middle"
            :columns="columns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="TABLE_LOCALE"
            :scroll="{ x: tableScrollX }"
            @change="(pag) => fetchList(pag.current)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'useStatus'">
                <Tag
                  :color="
                    record.useStatus === '2'
                      ? 'success'
                      : record.useStatus === '1'
                        ? 'processing'
                        : 'default'
                  "
                >
                  {{ useStatusLabel(record.useStatus) }}
                </Tag>
              </template>
              <template v-if="column.key === 'verifierStatus'">
                <Tag
                  :color="
                    record.verifierStatus === '2'
                      ? 'error'
                      : record.verifierStatus === '1'
                        ? 'success'
                        : 'default'
                  "
                >
                  {{ verifierStatusLabel(record.verifierStatus) }}
                </Tag>
              </template>
              <template v-if="column.key === 'amount'">
                {{ formatMoney(record.amount) }}
              </template>
              <template v-if="column.key === 'createTime'">
                {{ formatDate(record.createTime) }}
              </template>
            </template>
          </Table>

          <div class="legacy-finance-footer">
            <span>共{{ pagination.total }}条数据</span>
          </div>
        </section>

        <aside class="invoice-folder-side">
          <section class="invoice-folder-side-card">
            <div class="invoice-folder-side-title">票据详情</div>
            <Table
              class="legacy-finance-embedded-table"
              :columns="INFO_COLUMNS"
              :data-source="detailRows"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
              :locale="TABLE_LOCALE"
            />
          </section>

          <section class="invoice-folder-side-card">
            <div class="invoice-folder-side-title">发票明细</div>
            <Table
              class="legacy-finance-embedded-table"
              :columns="INFO_COLUMNS"
              :data-source="detailItemRows"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
              :locale="TABLE_LOCALE"
            />
          </section>

          <section class="invoice-folder-side-card">
            <div class="invoice-folder-side-title">发票核验</div>
            <Table
              class="legacy-finance-embedded-table"
              :columns="INFO_COLUMNS"
              :data-source="detailVerifyRows"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
              :locale="TABLE_LOCALE"
            />
          </section>

          <section class="invoice-folder-side-card">
            <div class="invoice-folder-side-title">发票使用</div>
            <Table
              class="legacy-finance-embedded-table"
              :columns="INFO_COLUMNS"
              :data-source="detailUsageRows"
              row-key="id"
              bordered
              size="small"
              :pagination="false"
              :locale="TABLE_LOCALE"
            />
          </section>
        </aside>
      </div>
    </div>

    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑发票' : '新增发票'"
      width="860px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :confirm-loading="submitting"
      @ok="handleSubmit"
    >
      <div class="legacy-finance-subdialog-body">
        <Form ref="formRef" :model="formState" layout="vertical">
          <div class="invoice-folder-form-grid">
            <Form.Item label="发票夹" name="folderName">
              <Input v-model:value="formState.folderName" />
            </Form.Item>
            <Form.Item
              label="发票号码"
              name="invoiceNo"
              :rules="[{ required: true, message: '请输入发票号码' }]"
            >
              <Input v-model:value="formState.invoiceNo" />
            </Form.Item>
            <Form.Item label="发票代码" name="code">
              <Input v-model:value="formState.code" />
            </Form.Item>
            <Form.Item label="文件名称" name="fileName">
              <Input v-model:value="formState.fileName" />
            </Form.Item>
            <Form.Item label="发票类型" name="invoiceType">
              <Select
                v-model:value="formState.invoiceType"
                :disabled="invoiceTypePolicy.readonly === true"
              >
                <Select.Option value="增值税电子普通发票"
                  >增值税电子普通发票</Select.Option
                >
                <Select.Option value="增值税专用发票"
                  >增值税专用发票</Select.Option
                >
                <Select.Option value="电子票据">电子票据</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="金额" name="amount">
              <InputNumber
                v-model:value="formState.amount"
                class="w-full"
                :min="0"
                :precision="2"
              />
            </Form.Item>
            <Form.Item label="提交人" name="userName">
              <Input v-model:value="formState.userName" />
            </Form.Item>
            <Form.Item label="申请人" name="applicant">
              <Input v-model:value="formState.applicant" />
            </Form.Item>
            <Form.Item label="关联单据编号" name="billNo">
              <Input v-model:value="formState.billNo" />
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" :rows="3" />
          </Form.Item>
        </Form>
      </div>
    </Modal>

    <Modal
      v-model:open="authOpen"
      :title="authTab === 'history' ? '授权记录' : '授权/取消授权'"
      width="760px"
      class="legacy-finance-subdialog"
      destroy-on-close
      @ok="handleAuthOk"
    >
      <div class="legacy-finance-subdialog-body">
        <div class="legacy-finance-tabs invoice-folder-auth-tabs">
          <button
            type="button"
            class="legacy-finance-tab"
            :class="{ 'is-active': authTab === 'edit' }"
            @click="authTab = 'edit'"
          >
            新增
          </button>
          <button
            type="button"
            class="legacy-finance-tab"
            :class="{ 'is-active': authTab === 'history' }"
            @click="authTab = 'history'"
          >
            授权记录
          </button>
        </div>

        <div v-if="authTab === 'edit'">
          <div class="invoice-folder-auth-toolbar">
            <Button
              type="primary"
              class="legacy-finance-button"
              @click="addAuthEntry"
            >
              新增
            </Button>
          </div>
          <Table
            class="legacy-finance-embedded-table"
            :columns="authColumns"
            :data-source="authEntries"
            row-key="id"
            bordered
            size="small"
            :pagination="false"
            :locale="TABLE_LOCALE"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'action'">
                <Button type="link" size="small">编辑</Button>
                <Button
                  type="link"
                  danger
                  size="small"
                  @click="removeAuthEntry(record.id)"
                  >删除</Button
                >
              </template>
            </template>
          </Table>
        </div>

        <Table
          v-else
          class="legacy-finance-embedded-table"
          :columns="authHistoryColumns"
          :data-source="authHistoryEntries"
          row-key="id"
          bordered
          size="small"
          :pagination="false"
          :locale="TABLE_LOCALE"
        />
      </div>
    </Modal>
  </Page>
</template>

<style scoped lang="scss">
.invoice-folder-layout {
  flex-direction: row;
  gap: 6px;
  padding: 4px;
}

.invoice-folder-main {
  min-width: 0;
  flex: 1 1 auto;
  padding: 0;
}

.invoice-folder-side {
  display: flex;
  width: 320px;
  min-width: 320px;
  flex-direction: column;
  gap: 6px;
}

.invoice-folder-side-card {
  display: flex;
  min-height: 0;
  flex: 1 1 0;
  flex-direction: column;
  border: 1px solid #d9e6f8;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.98);
}

.invoice-folder-side-title {
  padding: 8px 12px;
  border-bottom: 1px solid #e7eef9;
  color: #3b82f6;
  font-size: 14px;
  font-weight: 600;
}

.invoice-folder-form-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0 16px;
}

.invoice-folder-auth-tabs {
  margin-bottom: 10px;
}

.invoice-folder-auth-toolbar {
  margin-bottom: 10px;
}

.legacy-finance-button--danger.ant-btn {
  border-color: #ffb7b7;
  color: #e96b6b;
}

@media (max-width: 1280px) {
  .invoice-folder-layout {
    flex-direction: column;
  }

  .invoice-folder-side {
    width: 100%;
    min-width: 100%;
  }

  .invoice-folder-form-grid {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}
</style>
