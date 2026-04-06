<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { incomeSettlementApi, invoiceFolderApi } from '#/api/core/finance';
import {
  mergePageSchemaItems,
  resolvePageSchemaValue,
  resolveToolbarItem,
  usePageSchema,
} from '#/composables/usePageSchema';

import '../../finance/_shared/legacy-finance.scss';

type IncomePayeeRow = {
  amount?: number;
  bankAccount: string;
  bankName: string;
  contactType: string;
  payeeName: string;
  remark: string;
  seq: number;
};

type RelatedBillRow = {
  applyAmount?: number;
  billNo: string;
  claimType: string;
  purpose: string;
  seq: number;
};

type AttachmentRow = {
  attachmentType: string;
  fileName: string;
  operatorName: string;
  seq: number;
  uploadTime: string;
};

type InvoiceRow = {
  fileName: string;
  invoiceAmount?: number;
  invoiceCode: string;
  invoiceNo: string;
  invoiceType: string;
  operatorName: string;
  seq: number;
  uploadTime: string;
};

const TABLE_LOCALE = { emptyText: '暂无数据' };
const DEFAULT_SCROLL_X = 1640;

type IncomeSearchField = {
  key: string;
  label: string;
  order?: number;
  placeholder?: string;
  size?: 'normal' | 'wide' | 'xwide';
  visible?: boolean;
};

type IncomeToolbarItem = {
  key: string;
  label: string;
  order?: number;
  visible?: boolean;
};

type IncomeSectionItem = {
  id: string;
  key: string;
  label: string;
  order?: number;
  visible?: boolean;
};

type IncomeListColumn = {
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
const invoicePickerOpen = ref(false);
const invoicePickerLoading = ref(false);
const invoiceDataSource = ref<any[]>([]);
const activeSection = ref('form.basic');
const { runtime, schema: pageSchema } = usePageSchema(
  'finance.income-settlement',
);

const searchParams = ref({
  deptName: '',
  keyword: '',
  receiptMethod: undefined as string | undefined,
  status: undefined as string | undefined,
});

const pageTitle = computed(() => runtime.value?.pageName || '收入结算单');

const defaultSearchFields: IncomeSearchField[] = [
  {
    key: 'search.keyword',
    label: '关键字',
    order: 10,
    placeholder: '结算单号/收款人/发票号',
    size: 'xwide',
    visible: true,
  },
  {
    key: 'search.deptName',
    label: '部门',
    order: 20,
    placeholder: '部门',
    size: 'wide',
    visible: true,
  },
  {
    key: 'search.receiptMethod',
    label: '收款方式',
    order: 30,
    placeholder: '收款方式',
    size: 'normal',
    visible: true,
  },
  {
    key: 'search.status',
    label: '状态',
    order: 40,
    placeholder: '状态',
    size: 'normal',
    visible: true,
  },
];

const searchFields = computed(() =>
  mergePageSchemaItems(
    defaultSearchFields,
    resolvePageSchemaValue(pageSchema.value, ['search'], []),
  ),
);

const toolbarItems = computed(() =>
  mergePageSchemaItems<IncomeToolbarItem>(
    [
      {
        key: 'toolbar.add',
        label: '新增收入结算单',
        order: 10,
        visible: true,
      },
      { key: 'toolbar.edit', label: '修改', order: 20, visible: true },
      { key: 'toolbar.detail', label: '详情', order: 30, visible: true },
      { key: 'toolbar.delete', label: '删除', order: 40, visible: true },
      {
        key: 'toolbar.invoiceFolder',
        label: '发票夹',
        order: 50,
        visible: true,
      },
    ],
    resolvePageSchemaValue(pageSchema.value, ['toolbar'], []),
  ),
);

const addToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.add', '新增收入结算单'),
);
const editToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.edit', '修改'),
);
const detailToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.detail', '详情'),
);
const deleteToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.delete', '删除'),
);
const invoiceFolderToolbar = computed(() =>
  resolveToolbarItem(toolbarItems.value, 'toolbar.invoiceFolder', '发票夹'),
);

const defaultSectionItems: IncomeSectionItem[] = [
  {
    key: 'form.basic',
    label: '基本信息',
    id: 'income-basic-section',
    order: 10,
    visible: true,
  },
  {
    key: 'form.payee',
    label: '收款人',
    id: 'income-payee-section',
    order: 20,
    visible: true,
  },
  {
    key: 'form.related',
    label: '关联报销单',
    id: 'income-related-section',
    order: 30,
    visible: true,
  },
  {
    key: 'form.attachment',
    label: '附件',
    id: 'income-attachment-section',
    order: 40,
    visible: true,
  },
  {
    key: 'form.invoice',
    label: '电子发票',
    id: 'income-invoice-section',
    order: 50,
    visible: true,
  },
];

const sectionItems = computed(() =>
  mergePageSchemaItems(
    defaultSectionItems,
    resolvePageSchemaValue(pageSchema.value, ['form', 'sections'], []),
  ),
);

const visibleSectionKeys = computed(
  () => new Set(sectionItems.value.map((item) => item.key)),
);

function isSectionVisible(sectionKey: string) {
  return visibleSectionKeys.value.has(sectionKey);
}

function getSectionLabel(sectionKey: string, fallback: string) {
  return (
    sectionItems.value.find((item) => item.key === sectionKey)?.label ||
    fallback
  );
}

const defaultFillDate = () => new Date().toISOString().slice(0, 10);

const defaultPayeeRow = (seq: number): IncomePayeeRow => ({
  amount: 0,
  bankAccount: '',
  bankName: '',
  contactType: '往来单位',
  payeeName: '',
  remark: '',
  seq,
});

const defaultRelatedBillRow = (seq: number): RelatedBillRow => ({
  applyAmount: 0,
  billNo: '',
  claimType: '费用报销单',
  purpose: '',
  seq,
});

const defaultAttachmentRow = (seq: number): AttachmentRow => ({
  attachmentType: '合同',
  fileName: '',
  operatorName: '经办人',
  seq,
  uploadTime: defaultFillDate(),
});

const defaultInvoiceRow = (seq: number): InvoiceRow => ({
  fileName: '',
  invoiceAmount: 0,
  invoiceCode: '',
  invoiceNo: '',
  invoiceType: '电子票据',
  operatorName: '经办人',
  seq,
  uploadTime: defaultFillDate(),
});

const defaultForm = () => ({
  amount: 0,
  applicant: '',
  bankAccount: '',
  bankName: '',
  billNo: '',
  contactType: '往来单位',
  content: '',
  deptName: '',
  fileName: '',
  fillDate: defaultFillDate(),
  folderName: '默认发票夹',
  id: '',
  invoiceAmount: 0,
  invoiceItems: [defaultInvoiceRow(1)],
  invoiceNo: '',
  invoiceType: '电子票据',
  isSupplement: '0',
  occurDate: defaultFillDate(),
  payeeItems: [defaultPayeeRow(1)],
  payeeName: '',
  receiptCount: 1,
  receiptMethod: '自有资金支付',
  relatedBills: [defaultRelatedBillRow(1)],
  remark: '',
  status: '0',
  title: '',
  attachments: [defaultAttachmentRow(1)],
});

const formState = ref<any>(defaultForm());

const listColumns = computed(() =>
  mergePageSchemaItems<IncomeListColumn>(
    [
      { title: '状态', dataIndex: 'status', key: 'table.status', width: 90 },
      {
        title: '结算单号',
        dataIndex: 'billNo',
        key: 'table.billNo',
        width: 170,
      },
      {
        title: '收款人',
        dataIndex: 'payeeName',
        key: 'table.payeeName',
        width: 140,
      },
      {
        title: '部门',
        dataIndex: 'deptName',
        key: 'table.deptName',
        width: 170,
      },
      {
        title: '收款内容',
        dataIndex: 'content',
        key: 'table.content',
        width: 240,
      },
      {
        title: '收款方式',
        dataIndex: 'receiptMethod',
        key: 'table.receiptMethod',
        width: 130,
      },
      {
        title: '收款金额',
        dataIndex: 'amount',
        key: 'table.amount',
        width: 130,
      },
      {
        title: '发票号码',
        dataIndex: 'invoiceNo',
        key: 'table.invoiceNo',
        width: 170,
      },
      {
        title: '填报日期',
        dataIndex: 'fillDate',
        key: 'table.fillDate',
        width: 130,
      },
      {
        title: '创建时间',
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
    listColumns.value.reduce(
      (sum, item) => sum + Number(item.width || 120),
      0,
    ) + 80,
    DEFAULT_SCROLL_X,
  ),
);

const payeeColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  {
    title: '*收款人名称',
    dataIndex: 'payeeName',
    key: 'payeeName',
    width: 180,
  },
  {
    title: '*往来单位类型',
    dataIndex: 'contactType',
    key: 'contactType',
    width: 160,
  },
  {
    title: '银行账户',
    dataIndex: 'bankAccount',
    key: 'bankAccount',
    width: 180,
  },
  { title: '开户行', dataIndex: 'bankName', key: 'bankName', width: 180 },
  { title: '备注', dataIndex: 'remark', key: 'remark', width: 180 },
  { title: '*金额', dataIndex: 'amount', key: 'amount', width: 130 },
  { title: '操作', key: 'action', width: 88, fixed: 'right' as const },
];

const relatedBillColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '单号', dataIndex: 'billNo', key: 'billNo', width: 180 },
  { title: '单据类型', dataIndex: 'claimType', key: 'claimType', width: 160 },
  {
    title: '申请金额',
    dataIndex: 'applyAmount',
    key: 'applyAmount',
    width: 130,
  },
  { title: '资金用途', dataIndex: 'purpose', key: 'purpose', width: 220 },
  { title: '操作', key: 'action', width: 88 },
];

const attachmentColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
  { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 160 },
  {
    title: '附件类型',
    dataIndex: 'attachmentType',
    key: 'attachmentType',
    width: 140,
  },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
];

const invoiceColumns = [
  { title: '序号', dataIndex: 'seq', key: 'seq', width: 72 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName' },
  {
    title: '发票代码',
    dataIndex: 'invoiceCode',
    key: 'invoiceCode',
    width: 140,
  },
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 170 },
  {
    title: '发票金额',
    dataIndex: 'invoiceAmount',
    key: 'invoiceAmount',
    width: 130,
  },
  {
    title: '发票类型',
    dataIndex: 'invoiceType',
    key: 'invoiceType',
    width: 140,
  },
  { title: '上传时间', dataIndex: 'uploadTime', key: 'uploadTime', width: 160 },
  {
    title: '操作人',
    dataIndex: 'operatorName',
    key: 'operatorName',
    width: 120,
  },
];

const invoicePickerColumns = [
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 180 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 220 },
  {
    title: '发票类型',
    dataIndex: 'invoiceType',
    key: 'invoiceType',
    width: 160,
  },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '操作', key: 'action', width: 90 },
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

const currentPayeeTotal = computed(() =>
  (formState.value.payeeItems || []).reduce(
    (sum: number, item: IncomePayeeRow) => sum + Number(item.amount || 0),
    0,
  ),
);

function ensureSequence<T extends { seq: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, seq: index + 1 }));
}

function hydrateForm(record?: any) {
  if (!record) {
    return defaultForm();
  }

  const nextPayeeItems =
    Array.isArray(record.payeeItems) && record.payeeItems.length > 0
      ? ensureSequence(record.payeeItems)
      : [
          {
            ...defaultPayeeRow(1),
            amount: Number(record.amount || 0),
            bankAccount: record.bankAccount || '',
            bankName: record.bankName || '',
            contactType: record.contactType || '往来单位',
            payeeName: record.payeeName || '',
          },
        ];

  const nextInvoiceItems =
    Array.isArray(record.invoiceItems) && record.invoiceItems.length > 0
      ? ensureSequence(record.invoiceItems)
      : [
          {
            ...defaultInvoiceRow(1),
            fileName: record.fileName || '',
            invoiceAmount: Number(record.invoiceAmount || 0),
            invoiceNo: record.invoiceNo || '',
            invoiceType: record.invoiceType || '电子票据',
          },
        ];

  return {
    ...defaultForm(),
    ...record,
    attachments:
      Array.isArray(record.attachments) && record.attachments.length > 0
        ? ensureSequence(record.attachments)
        : [defaultAttachmentRow(1)],
    fillDate:
      record.fillDate || record.createTime?.slice(0, 10) || defaultFillDate(),
    invoiceItems: nextInvoiceItems,
    occurDate:
      record.occurDate || record.updateTime?.slice(0, 10) || defaultFillDate(),
    payeeItems: nextPayeeItems,
    receiptCount: Number(record.receiptCount || 1),
    relatedBills:
      Array.isArray(record.relatedBills) && record.relatedBills.length > 0
        ? ensureSequence(record.relatedBills)
        : [defaultRelatedBillRow(1)],
  };
}

function scrollToSection(sectionId: string) {
  activeSection.value =
    sectionItems.value.find((item) => item.id === sectionId)?.key ||
    'form.basic';
  document
    .querySelector<HTMLElement>(`#${sectionId}`)
    ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

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

const statusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'default', text: '草稿' },
  '1': { color: 'processing', text: '已提交' },
  '2': { color: 'success', text: '已完成' },
};

async function fetchList(page = 1) {
  try {
    loading.value = true;
    const res = await incomeSettlementApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = Array.isArray(res?.items)
      ? res.items.map((item: any) => ({
          ...item,
          fillDate: item.fillDate || item.createTime?.slice(0, 10) || '',
        }))
      : [];
    pagination.value.current = page;
    pagination.value.total = Number(res?.total || 0);
    selectedRowKeys.value = [];
  } finally {
    loading.value = false;
  }
}

async function openModal(record?: any) {
  formState.value = record?.id
    ? hydrateForm(await incomeSettlementApi.getById(record.id))
    : defaultForm();
  activeSection.value = sectionItems.value[0]?.key || 'form.basic';
  isModalVisible.value = true;
}

function openSelectedEditor() {
  if (!selectedRecord.value) {
    return message.warning('请选择一条收入结算单数据');
  }
  void openModal(selectedRecord.value);
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    const payload = {
      ...formState.value,
      amount: Number(formState.value.amount || 0),
      attachments: ensureSequence(formState.value.attachments || []),
      invoiceItems: ensureSequence(formState.value.invoiceItems || []),
      payeeItems: ensureSequence(formState.value.payeeItems || []),
      relatedBills: ensureSequence(formState.value.relatedBills || []),
      title:
        formState.value.title ||
        formState.value.content ||
        formState.value.billNo ||
        '收入结算单',
    };
    if (payload.id) {
      await incomeSettlementApi.update(payload.id, payload);
      message.success('更新收入结算单成功');
    } else {
      await incomeSettlementApi.create(payload);
      message.success('新增收入结算单成功');
    }
    isModalVisible.value = false;
    await fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await incomeSettlementApi.remove(id);
  message.success('删除收入结算单成功');
  await fetchList(1);
}

async function deleteSelectedRecord() {
  if (!selectedRecord.value) {
    return message.warning('请选择一条收入结算单数据');
  }
  await handleDelete(selectedRecord.value.id);
}

function resetFilters() {
  searchParams.value = {
    deptName: '',
    keyword: '',
    receiptMethod: undefined,
    status: undefined,
  };
  void fetchList(1);
}

function openInvoiceFolder() {
  window.open('/finance/invoice-folder', '_blank');
}

async function openInvoicePicker() {
  try {
    invoicePickerLoading.value = true;
    invoicePickerOpen.value = true;
    const res = await invoiceFolderApi.getList({
      page: 1,
      pageSize: 200,
      useStatus: '0',
    });
    invoiceDataSource.value = res?.items || [];
  } finally {
    invoicePickerLoading.value = false;
  }
}

function applyInvoice(record: any) {
  formState.value.invoiceNo = record.invoiceNo || '';
  formState.value.invoiceAmount = Number(record.amount || 0);
  formState.value.fileName = record.fileName || '';
  formState.value.folderName = record.folderName || '默认发票夹';
  formState.value.invoiceType = record.invoiceType || '电子票据';

  const currentItems = Array.isArray(formState.value.invoiceItems)
    ? [...formState.value.invoiceItems]
    : [];
  if (!currentItems.some((item) => item.invoiceNo === record.invoiceNo)) {
    currentItems.push({
      ...defaultInvoiceRow(currentItems.length + 1),
      fileName: record.fileName || '',
      invoiceAmount: Number(record.amount || 0),
      invoiceCode: record.code || '',
      invoiceNo: record.invoiceNo || '',
      invoiceType: record.invoiceType || '电子票据',
      operatorName: record.userName || '经办人',
      uploadTime: record.createTime || defaultFillDate(),
    });
  }
  formState.value.invoiceItems = ensureSequence(currentItems);
  invoicePickerOpen.value = false;
}

function addPayeeRow() {
  formState.value.payeeItems = ensureSequence([
    ...(formState.value.payeeItems || []),
    defaultPayeeRow((formState.value.payeeItems || []).length + 1),
  ]);
}

function removePayeeRow(index: number) {
  const nextItems = [...(formState.value.payeeItems || [])];
  nextItems.splice(index, 1);
  formState.value.payeeItems = ensureSequence(
    nextItems.length > 0 ? nextItems : [defaultPayeeRow(1)],
  );
}

function addRelatedBillRow() {
  formState.value.relatedBills = ensureSequence([
    ...(formState.value.relatedBills || []),
    defaultRelatedBillRow((formState.value.relatedBills || []).length + 1),
  ]);
}

function removeRelatedBillRow(index: number) {
  const nextItems = [...(formState.value.relatedBills || [])];
  nextItems.splice(index, 1);
  formState.value.relatedBills = ensureSequence(
    nextItems.length > 0 ? nextItems : [defaultRelatedBillRow(1)],
  );
}

function addAttachmentRow() {
  formState.value.attachments = ensureSequence([
    ...(formState.value.attachments || []),
    defaultAttachmentRow((formState.value.attachments || []).length + 1),
  ]);
}

function addInvoiceRow() {
  formState.value.invoiceItems = ensureSequence([
    ...(formState.value.invoiceItems || []),
    defaultInvoiceRow((formState.value.invoiceItems || []).length + 1),
  ]);
}

function showPlaceholder(label: string) {
  message.info(`${label}先按原系统布局保留入口，本轮继续补齐视觉对齐。`);
}

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
            <Input
              v-if="field.key === 'search.keyword'"
              v-model:value="searchParams.keyword"
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            />
            <Input
              v-else-if="field.key === 'search.deptName'"
              v-model:value="searchParams.deptName"
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            />
            <Select
              v-else-if="field.key === 'search.receiptMethod'"
              v-model:value="searchParams.receiptMethod"
              allow-clear
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            >
              <Select.Option value="自有资金支付">自有资金支付</Select.Option>
              <Select.Option value="银行转账">银行转账</Select.Option>
              <Select.Option value="授权支付">授权支付</Select.Option>
            </Select>
            <Select
              v-else-if="field.key === 'search.status'"
              v-model:value="searchParams.status"
              allow-clear
              :placeholder="field.placeholder"
              :class="[
                'legacy-finance-search-input',
                field.size === 'wide' && 'legacy-finance-search-input--wide',
                field.size === 'xwide' && 'legacy-finance-search-input--xwide',
              ]"
            >
              <Select.Option value="0">草稿</Select.Option>
              <Select.Option value="1">已提交</Select.Option>
              <Select.Option value="2">已完成</Select.Option>
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
            v-if="addToolbar.visible"
            type="primary"
            class="legacy-finance-button"
            @click="openModal()"
          >
            {{ addToolbar.label }}
          </Button>
          <Button
            v-if="editToolbar.visible"
            class="legacy-finance-button"
            @click="openSelectedEditor"
          >
            {{ editToolbar.label }}
          </Button>
          <Button
            v-if="detailToolbar.visible"
            class="legacy-finance-button"
            @click="openSelectedEditor"
          >
            {{ detailToolbar.label }}
          </Button>
          <Popconfirm
            v-if="deleteToolbar.visible"
            title="确定删除选中数据吗？"
            @confirm="deleteSelectedRecord"
          >
            <Button class="legacy-finance-button">{{
              deleteToolbar.label
            }}</Button>
          </Popconfirm>
          <Button
            v-if="invoiceFolderToolbar.visible"
            class="legacy-finance-button"
            @click="openInvoiceFolder"
          >
            {{ invoiceFolderToolbar.label }}
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
            :columns="listColumns"
            :data-source="dataSource"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="TABLE_LOCALE"
            :scroll="{ x: tableScrollX }"
            @change="(pag) => fetchList(pag.current)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag :color="statusMap[record.status]?.color || 'default'">
                  {{ statusMap[record.status]?.text || '-' }}
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
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isModalVisible" class="legacy-finance-form-overlay">
        <div class="legacy-finance-form-dialog">
          <div class="legacy-finance-form-topbar">
            <div class="legacy-finance-accessory">收入结算单</div>
            <h2 class="legacy-finance-form-title">收入结报单</h2>
            <Button
              class="legacy-finance-form-close"
              @click="isModalVisible = false"
            >
              返回列表
            </Button>
          </div>

          <div class="legacy-finance-form-layout">
            <aside class="legacy-finance-form-aside">
              <button
                v-for="item in sectionItems"
                :key="item.key"
                type="button"
                class="legacy-finance-form-nav"
                :class="{ 'is-active': activeSection === item.key }"
                @click="scrollToSection(item.id)"
              >
                <span>{{ item.label }}</span>
              </button>
            </aside>

            <div class="legacy-finance-form-main">
              <Form
                ref="formRef"
                :model="formState"
                :colon="false"
                layout="horizontal"
                label-align="left"
                class="legacy-finance-form legacy-finance-form-body"
              >
                <section
                  v-if="isSectionVisible('form.basic')"
                  id="income-basic-section"
                  class="legacy-finance-form-section"
                >
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">{{
                      getSectionLabel('form.basic', '基本信息')
                    }}</span>
                  </div>

                  <div class="legacy-finance-form-grid">
                    <Form.Item label="单号" name="billNo">
                      <Input
                        v-model:value="formState.billNo"
                        placeholder="保存后自动生成"
                      />
                    </Form.Item>

                    <Form.Item label="填报日期" name="fillDate">
                      <DatePicker
                        v-model:value="formState.fillDate"
                        class="w-full"
                        value-format="YYYY-MM-DD"
                      />
                    </Form.Item>

                    <Form.Item label="申请人" name="applicant">
                      <Input
                        v-model:value="formState.applicant"
                        placeholder="请输入申请人"
                      />
                    </Form.Item>

                    <Form.Item label="部门" name="deptName">
                      <Input
                        v-model:value="formState.deptName"
                        placeholder="请输入部门"
                      />
                    </Form.Item>

                    <Form.Item label="发生日期" name="occurDate">
                      <DatePicker
                        v-model:value="formState.occurDate"
                        class="w-full"
                        value-format="YYYY-MM-DD"
                      />
                    </Form.Item>

                    <Form.Item
                      label="*单据(张)"
                      name="receiptCount"
                      :rules="[{ required: true, message: '请输入单据张数' }]"
                    >
                      <InputNumber
                        v-model:value="formState.receiptCount"
                        class="w-full"
                        :min="1"
                        :controls="false"
                      />
                    </Form.Item>

                    <Form.Item label="*是否补录" name="isSupplement">
                      <Radio.Group v-model:value="formState.isSupplement">
                        <Radio value="1">是</Radio>
                        <Radio value="0">否</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      label="*收款金额"
                      name="amount"
                      :rules="[{ required: true, message: '请输入收款金额' }]"
                    >
                      <InputNumber
                        v-model:value="formState.amount"
                        class="w-full"
                        :min="0"
                        :precision="2"
                      />
                    </Form.Item>

                    <Form.Item label="收款方式" name="receiptMethod">
                      <Select v-model:value="formState.receiptMethod">
                        <Select.Option value="自有资金支付"
                          >自有资金支付</Select.Option
                        >
                        <Select.Option value="银行转账">银行转账</Select.Option>
                        <Select.Option value="授权支付">授权支付</Select.Option>
                      </Select>
                    </Form.Item>

                    <Form.Item
                      class="legacy-finance-span-3"
                      label="*收款内容"
                      name="content"
                      :rules="[{ required: true, message: '请输入收款内容' }]"
                    >
                      <Input.TextArea
                        v-model:value="formState.content"
                        :rows="3"
                        placeholder="请输入收款内容"
                      />
                    </Form.Item>
                  </div>
                </section>

                <section
                  v-if="isSectionVisible('form.payee')"
                  id="income-payee-section"
                  class="legacy-finance-form-section"
                >
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">{{
                      getSectionLabel('form.payee', '收款人')
                    }}</span>
                    <div class="legacy-finance-section-actions">
                      <Button
                        type="primary"
                        class="legacy-finance-button"
                        @click="addPayeeRow"
                      >
                        新增行
                      </Button>
                    </div>
                  </div>

                  <div class="legacy-finance-hint-bar">
                    数据量：{{ formState.payeeItems.length }}，收款金额合计：
                    <strong>{{ formatMoney(currentPayeeTotal) }}</strong>
                  </div>

                  <Table
                    class="legacy-finance-embedded-table"
                    bordered
                    size="small"
                    :columns="payeeColumns"
                    :data-source="formState.payeeItems"
                    :pagination="false"
                    :locale="TABLE_LOCALE"
                    :scroll="{ x: 1260 }"
                    row-key="seq"
                  >
                    <template #bodyCell="{ column, record, index }">
                      <template v-if="column.key === 'payeeName'">
                        <Input
                          v-model:value="record.payeeName"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'contactType'">
                        <Select
                          v-model:value="record.contactType"
                          class="legacy-finance-table-field"
                        >
                          <Select.Option value="往来单位"
                            >往来单位</Select.Option
                          >
                          <Select.Option value="个人">个人</Select.Option>
                        </Select>
                      </template>
                      <template v-if="column.key === 'bankAccount'">
                        <Input
                          v-model:value="record.bankAccount"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'bankName'">
                        <Input
                          v-model:value="record.bankName"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'remark'">
                        <Input
                          v-model:value="record.remark"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'amount'">
                        <InputNumber
                          v-model:value="record.amount"
                          class="legacy-finance-table-field"
                          :min="0"
                          :precision="2"
                        />
                      </template>
                      <template v-if="column.key === 'action'">
                        <Button
                          type="link"
                          danger
                          size="small"
                          @click="removePayeeRow(index)"
                        >
                          删除
                        </Button>
                      </template>
                    </template>
                  </Table>
                </section>

                <section
                  v-if="isSectionVisible('form.related')"
                  id="income-related-section"
                  class="legacy-finance-form-section"
                >
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">{{
                      getSectionLabel('form.related', '关联报销单')
                    }}</span>
                    <div class="legacy-finance-section-actions">
                      <Button
                        type="primary"
                        class="legacy-finance-button"
                        @click="addRelatedBillRow"
                      >
                        新增
                      </Button>
                    </div>
                  </div>

                  <div class="legacy-finance-hint-bar">
                    数据量：{{ formState.relatedBills.length }}
                  </div>

                  <Table
                    class="legacy-finance-embedded-table"
                    bordered
                    size="small"
                    :columns="relatedBillColumns"
                    :data-source="formState.relatedBills"
                    :pagination="false"
                    :locale="TABLE_LOCALE"
                    :scroll="{ x: 980 }"
                    row-key="seq"
                  >
                    <template #bodyCell="{ column, record, index }">
                      <template v-if="column.key === 'billNo'">
                        <Input
                          v-model:value="record.billNo"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'claimType'">
                        <Select
                          v-model:value="record.claimType"
                          class="legacy-finance-table-field"
                        >
                          <Select.Option value="费用报销单"
                            >费用报销单</Select.Option
                          >
                          <Select.Option value="差旅费报销单"
                            >差旅费报销单</Select.Option
                          >
                          <Select.Option value="会议费报销单"
                            >会议费报销单</Select.Option
                          >
                        </Select>
                      </template>
                      <template v-if="column.key === 'applyAmount'">
                        <InputNumber
                          v-model:value="record.applyAmount"
                          class="legacy-finance-table-field"
                          :min="0"
                          :precision="2"
                        />
                      </template>
                      <template v-if="column.key === 'purpose'">
                        <Input
                          v-model:value="record.purpose"
                          class="legacy-finance-table-field"
                        />
                      </template>
                      <template v-if="column.key === 'action'">
                        <Button
                          type="link"
                          danger
                          size="small"
                          @click="removeRelatedBillRow(index)"
                        >
                          删除
                        </Button>
                      </template>
                    </template>
                  </Table>
                </section>

                <section
                  v-if="isSectionVisible('form.attachment')"
                  id="income-attachment-section"
                  class="legacy-finance-form-section"
                >
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">
                      {{ getSectionLabel('form.attachment', '附件') }}
                    </span>
                    <div class="legacy-finance-section-actions">
                      <Button
                        type="primary"
                        class="legacy-finance-button"
                        @click="addInvoiceRow"
                      >
                        上传
                      </Button>
                      <Button
                        class="legacy-finance-button"
                        @click="showPlaceholder('附件分类')"
                      >
                        附件分类
                      </Button>
                    </div>
                  </div>

                  <div class="legacy-finance-hint-bar">
                    上传格式为
                    pdf、doc、docx、xls、xlsx、jpg、png、zip、rar、ofd 文件。
                  </div>

                  <Table
                    class="legacy-finance-embedded-table"
                    bordered
                    size="small"
                    :columns="attachmentColumns"
                    :data-source="formState.attachments"
                    :pagination="false"
                    :locale="TABLE_LOCALE"
                    row-key="seq"
                  />
                </section>

                <section
                  v-if="isSectionVisible('form.invoice')"
                  id="income-invoice-section"
                  class="legacy-finance-form-section"
                >
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">{{
                      getSectionLabel('form.invoice', '电子发票')
                    }}</span>
                    <div class="legacy-finance-section-actions">
                      <Button
                        type="primary"
                        class="legacy-finance-button"
                        @click="addAttachmentRow"
                      >
                        上传
                      </Button>
                      <Button
                        class="legacy-finance-button"
                        @click="openInvoicePicker"
                      >
                        发票夹列表
                      </Button>
                    </div>
                  </div>

                  <div class="legacy-finance-hint-bar">
                    上传格式为 pdf 文件，单个文件不可超过 10M，可上传 10
                    个文件。
                  </div>

                  <Table
                    class="legacy-finance-embedded-table"
                    bordered
                    size="small"
                    :columns="invoiceColumns"
                    :data-source="formState.invoiceItems"
                    :pagination="false"
                    :locale="TABLE_LOCALE"
                    :scroll="{ x: 1100 }"
                    row-key="seq"
                  >
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'invoiceAmount'">
                        {{ formatMoney(record.invoiceAmount) }}
                      </template>
                    </template>
                  </Table>
                </section>
              </Form>

              <div class="legacy-finance-form-footer">
                <Button
                  type="primary"
                  :loading="submitting"
                  @click="handleSubmit"
                >
                  保存
                </Button>
                <Button @click="isModalVisible = false">返回</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Modal
      v-model:open="invoicePickerOpen"
      title="发票夹列表"
      width="980px"
      class="legacy-finance-subdialog"
      destroy-on-close
      :footer="null"
    >
      <div class="legacy-finance-subdialog-body">
        <Table
          class="legacy-finance-embedded-table"
          :columns="invoicePickerColumns"
          :data-source="invoiceDataSource"
          :loading="invoicePickerLoading"
          row-key="id"
          bordered
          size="small"
          :pagination="false"
          :locale="TABLE_LOCALE"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">
              {{ formatMoney(record.amount) }}
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="applyInvoice(record)"
                >选择</Button
              >
            </template>
          </template>
        </Table>
      </div>
    </Modal>
  </Page>
</template>
