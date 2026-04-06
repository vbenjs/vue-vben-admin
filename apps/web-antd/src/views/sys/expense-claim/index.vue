<script setup lang="ts">
import { computed, h, onMounted, ref } from 'vue';

import {
  AppstoreOutlined,
  CloseOutlined,
  FileImageOutlined,
  FileOutlined,
  LinkOutlined,
  PaperClipOutlined,
  TableOutlined,
} from '@ant-design/icons-vue';
import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  DatePicker,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tag,
} from 'ant-design-vue';

import { invoiceFolderApi } from '#/api/core/finance';
import { expenseClaimApi } from '#/api/core/sys-manage';

import { scrollLegacySection } from '../_shared/legacy-indicator';
import LegacyPickerInput from '../_shared/LegacyPickerInput.vue';
import {
  accountTypeOptions,
  attachmentColumns,
  claimConfigs,
  CLAIM_TYPES,
  dropdownClaimTypeOptions,
  eInvoiceColumns,
  emptyAttachmentRow,
  emptyEInvoiceRow,
  emptyIndicatorRow,
  emptyMeetingRow,
  emptyPayeeRow,
  emptyRelatedBillRow,
  emptyTrainingRow,
  emptyTravelRow,
  financeTableLocale,
  historyColumns,
  invoiceColumns,
  listColumns,
  listTabs,
  meetingColumns,
  payeeColumns,
  relatedBillColumns,
  searchClaimTypeOptions,
  templateColumns,
  titleOptions,
  trainingColumns,
  travelColumns,
  type ClaimTypeValue,
} from './legacy-claim-config';

import '../../finance/_shared/legacy-finance.scss';

const userStore = useUserStore();

const navIconMap = {
  attachment: h(PaperClipOutlined),
  basic: h(FileOutlined),
  eInvoice: h(FileImageOutlined),
  grid: h(AppstoreOutlined),
  link: h(LinkOutlined),
  table: h(TableOutlined),
};

type DateRangeValue = [string, string] | undefined;

const defaultForm = () => ({
  applicant: '',
  attachPages: 0,
  claimAmount: 0,
  claimDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  claimNo: '',
  claimType: CLAIM_TYPES.BATCH as ClaimTypeValue,
  companionCount: 0,
  deptName: '',
  details: [] as any[],
  fillDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  flowNode: '',
  flowStatus: '0',
  fundUsage: '',
  hasEInvoice: '0',
  indicatorInfo: '',
  invoiceNo: '',
  isSupplement: '0',
  meetingDateRange: undefined as DateRangeValue,
  meetingDays: 0,
  meetingName: '',
  meetingPlace: '',
  meetingStandard: '',
  occurDate: '',
  operatorName: userStore.userInfo?.realName || '',
  payableAmount: 0,
  paymentMethod: '',
  projectName: '',
  receptionCount: 0,
  receptionDateRange: undefined as DateRangeValue,
  receptionDays: 0,
  receptionStandard: 0,
  receptionTarget: '',
  remark: '',
  settlementMethod: '',
  standardLimit: 0,
  standardType: '',
  status: '0',
  titleAmount: '',
  trainingDateRange: undefined as DateRangeValue,
  trainingDays: 0,
  trainingPlace: '',
  traineeCount: 0,
  travelReason: '',
  workerCount: 0,
});

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 20, total: 0 });
const selectedRowKeys = ref<Array<number | string>>([]);
const isFormVisible = ref(false);
const isDetailMode = ref(false);
const submitting = ref(false);
const activeListTab = ref<'done' | 'draft' | 'finished' | 'todo'>('todo');
const activeNavKey = ref('basic');
const templatePickerOpen = ref(false);
const templateManagerOpen = ref(false);
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const invoicePickerOpen = ref(false);
const invoicePickerLoading = ref(false);
const invoiceDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('审核历史');

const formRef = ref();
const formState = ref<any>(defaultForm());
const trainingRows = ref<any[]>([]);
const meetingRows = ref<any[]>([]);
const travelRows = ref<any[]>([]);
const payeeRows = ref<any[]>([]);
const relatedBillRows = ref<any[]>([]);
const attachmentRows = ref<any[]>([]);
const eInvoiceRows = ref<any[]>([]);

const templateDataSource = ref([
  {
    createTime: '2026-04-02 15:12:20',
    creatorName: '卓雪琪',
    id: 'tpl-001',
    templateName: '4月份在编人员费用报销',
  },
]);

const searchParams = ref({
  amountKeyword: '',
  claimDateRange: undefined as DateRangeValue,
  claimType: undefined as ClaimTypeValue | undefined,
  fundUsage: '',
  indicatorKeyword: '',
});

const currentClaimConfig = computed(
  () => claimConfigs[formState.value.claimType as ClaimTypeValue] || claimConfigs[CLAIM_TYPES.BATCH],
);

const displayedRows = computed(() =>
  dataSource.value.filter((item) => {
    const flowStatus = `${item.flowStatus || ''}`;
    const isFinished = flowStatus === '1' && `${item.flowNode || ''}`.includes('流程结束');
    if (activeListTab.value === 'draft' && flowStatus === '1') return false;
    if (activeListTab.value === 'finished' && !isFinished) return false;
    if (activeListTab.value === 'done' && flowStatus !== '1') return false;
    if (searchParams.value.claimType && item.claimType !== searchParams.value.claimType) return false;
    if (
      searchParams.value.indicatorKeyword &&
      !`${item.indicatorInfo || ''}`.includes(searchParams.value.indicatorKeyword)
    )
      return false;
    if (searchParams.value.fundUsage && !`${item.fundUsage || ''}`.includes(searchParams.value.fundUsage))
      return false;
    if (searchParams.value.amountKeyword && !`${item.claimAmount || ''}`.includes(searchParams.value.amountKeyword))
      return false;
    if (searchParams.value.claimDateRange?.length === 2) {
      const [startDate, endDate] = searchParams.value.claimDateRange;
      const time = new Date(item.fillDate || item.claimDate || '').getTime();
      const start = new Date(startDate).getTime();
      const end = new Date(endDate).getTime();
      if (Number.isFinite(time) && (time < start || time > end)) return false;
    }
    return true;
  }),
);

const displayedAmount = computed(() =>
  displayedRows.value.reduce((sum, item) => sum + Number(item.claimAmount || 0), 0),
);

const selectedRecord = computed(() =>
  displayedRows.value.find((item) => String(item.id) === String(selectedRowKeys.value[0] || '')),
);

const rowSelection = computed(() => ({
  selectedRowKeys: selectedRowKeys.value,
  type: 'radio' as const,
  onChange: (keys: Array<number | string>) => {
    selectedRowKeys.value = keys;
  },
}));

const indicatorRows = computed(() =>
  (formState.value.details || []).map((item: any, index: number) => ({ ...item, seq: index + 1 })),
);
const payeeTableRows = computed(() => payeeRows.value.map((item, index) => ({ ...item, seq: index + 1 })));
const relatedBillTableRows = computed(() =>
  relatedBillRows.value.map((item, index) => ({ ...item, seq: index + 1 })),
);
const trainingTableRows = computed(() =>
  trainingRows.value.map((item, index) => ({ ...item, seq: index + 1 })),
);
const meetingTableRows = computed(() =>
  meetingRows.value.map((item, index) => ({ ...item, seq: index + 1 })),
);
const travelTableRows = computed(() =>
  travelRows.value.map((item, index) => ({ ...item, seq: index + 1 })),
);
const attachmentTableRows = computed(() =>
  attachmentRows.value.map((item, index) => ({ ...item, actionLabel: '查看', seq: index + 1 })),
);
const invoiceTableRows = computed(() =>
  eInvoiceRows.value.map((item, index) => ({ ...item, actionLabel: '查看', seq: index + 1 })),
);

function formatDate(value?: string) {
  return value ? new Date(value).toISOString().slice(0, 10) : '-';
}

function formatDateTime(value?: string) {
  return value ? new Date(value).toLocaleString('zh-CN') : '-';
}

function formatMoney(value?: number | string) {
  return Number(value || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getColumnField(column: { dataIndex?: unknown; key?: unknown }) {
  if (typeof column.dataIndex === 'string') {
    return column.dataIndex;
  }
  if (typeof column.key === 'string' || typeof column.key === 'number') {
    return `${column.key}`;
  }
  return '';
}

function resolveStatus(record: any) {
  if (`${record.flowStatus || ''}` !== '1') return { color: 'default', text: '草稿' };
  if (`${record.flowNode || ''}`.includes('流程结束')) return { color: 'success', text: '办结' };
  return { color: 'processing', text: '待办' };
}

function resolveProgress(record: any) {
  if (`${record.flowStatus || ''}` !== '1') return '0%';
  if (`${record.flowNode || ''}`.includes('流程结束')) return '100%';
  return '50%';
}

function resetSearch() {
  searchParams.value = {
    amountKeyword: '',
    claimDateRange: undefined,
    claimType: undefined,
    fundUsage: '',
    indicatorKeyword: '',
  };
}

function showPlaceholderMessage(label: string) {
  message.info(`${label}功能后续会按原系统交互继续补齐`);
}

function resetCollections() {
  formState.value.details = Array.isArray(formState.value.details) ? formState.value.details : [];
  trainingRows.value = currentClaimConfig.value.showTraining ? [emptyTrainingRow()] : [];
  meetingRows.value = currentClaimConfig.value.showMeeting ? [emptyMeetingRow()] : [];
  travelRows.value = currentClaimConfig.value.showTravel ? [emptyTravelRow()] : [];
  payeeRows.value = [];
  relatedBillRows.value = [];
  attachmentRows.value = [emptyAttachmentRow()];
  eInvoiceRows.value = [];
}

function syncAmountFromDetails() {
  const total = (formState.value.details || []).reduce(
    (sum: number, item: any) => sum + Number(item.applyAmount || 0),
    0,
  );
  if (total > 0) {
    formState.value.claimAmount = total;
    if (!Number(formState.value.payableAmount || 0)) formState.value.payableAmount = total;
  }
}

async function fetchList(page = 1) {
  try {
    loading.value = true;
    const response = await expenseClaimApi.getList({
      fiscalYear: userStore.userInfo?.fiscalYear || '',
      page,
      pageSize: pagination.value.pageSize,
    });
    dataSource.value = Array.isArray(response?.items) ? response.items : [];
    pagination.value.current = page;
    pagination.value.total = Number(response?.total || 0);
  } finally {
    loading.value = false;
  }
}

function openCreateByType(type: ClaimTypeValue) {
  formState.value = {
    ...defaultForm(),
    applicant: userStore.userInfo?.realName || '',
    claimType: type,
    deptName: userStore.userInfo?.deptName || '',
    operatorName: userStore.userInfo?.realName || '',
  };
  isDetailMode.value = false;
  activeNavKey.value = 'basic';
  resetCollections();
  isFormVisible.value = true;
}

async function openRecord(record?: any, detailMode = false) {
  const detail = record?.id ? await expenseClaimApi.getById(record.id) : defaultForm();
  formState.value = {
    ...defaultForm(),
    ...detail,
    claimType: detail?.claimType || record?.claimType || CLAIM_TYPES.BATCH,
    fillDate: detail?.fillDate ? formatDate(detail.fillDate) : defaultForm().fillDate,
    claimDate: detail?.claimDate ? formatDate(detail.claimDate) : defaultForm().claimDate,
    occurDate: detail?.claimDate ? formatDate(detail.claimDate) : '',
    operatorName: detail?.operatorName || detail?.fillerName || userStore.userInfo?.realName || '',
  };
  isDetailMode.value = detailMode;
  activeNavKey.value = 'basic';
  resetCollections();
  isFormVisible.value = true;
}

async function persistForm(closeAfterSave = true) {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    syncAmountFromDetails();
    formState.value.invoiceNo = eInvoiceRows.value.map((item) => item.invoiceNo).filter(Boolean).join(',');
    const payload = { ...formState.value, details: formState.value.details || [] };
    const result = formState.value.id
      ? await expenseClaimApi.update(formState.value.id, payload)
      : await expenseClaimApi.create(payload);
    message.success(closeAfterSave ? '报账申请保存成功' : '报账申请暂存成功');
    await fetchList(closeAfterSave ? 1 : pagination.value.current);
    if (closeAfterSave) {
      isFormVisible.value = false;
      return;
    }
    formState.value = {
      ...formState.value,
      ...result,
      fillDate: result?.fillDate ? formatDate(result.fillDate) : formState.value.fillDate,
      claimDate: result?.claimDate ? formatDate(result.claimDate) : formState.value.claimDate,
    };
  } catch (error: any) {
    if (!error?.errorFields) message.error(error?.message || '报账申请保存失败');
  } finally {
    submitting.value = false;
  }
}

async function deleteSelectedRecord() {
  if (!selectedRecord.value) return message.warning('请选择一条报账申请数据');
  await expenseClaimApi.remove(selectedRecord.value.id);
  message.success('删除报账申请成功');
  selectedRowKeys.value = [];
  await fetchList(pagination.value.current);
}

async function submitSelectedRecord() {
  if (!selectedRecord.value) return message.warning('请选择一条报账申请数据');
  await expenseClaimApi.submit(selectedRecord.value.id);
  message.success('报账申请送审成功');
  await fetchList(pagination.value.current);
}

function copySelectedRecord() {
  if (!selectedRecord.value) return message.warning('请选择一条报账申请数据');
  formState.value = {
    ...defaultForm(),
    ...selectedRecord.value,
    claimNo: '',
    flowNode: '',
    flowStatus: '0',
    id: undefined,
    status: '0',
  };
  resetCollections();
  activeNavKey.value = 'basic';
  isFormVisible.value = true;
}

async function openHistory(record?: any) {
  const target = record || selectedRecord.value;
  if (!target) return message.warning('请选择一条报账申请数据');
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${target.claimNo || ''}`;
    const history = await expenseClaimApi.getHistory(target.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
}

async function openInvoicePicker() {
  try {
    invoicePickerLoading.value = true;
    invoicePickerOpen.value = true;
    const response = await invoiceFolderApi.getList({ page: 1, pageSize: 100, useStatus: '0' });
    invoiceDataSource.value = Array.isArray(response?.items) ? response.items : [];
  } finally {
    invoicePickerLoading.value = false;
  }
}

function applyInvoice(record: any) {
  eInvoiceRows.value = [
    ...eInvoiceRows.value,
    {
      ...emptyEInvoiceRow(),
      amount: Number(record.amount || 0),
      fileName: record.fileName || record.invoiceNo || '',
      invoiceCode: record.invoiceCode || '',
      invoiceNo: record.invoiceNo || '',
      invoiceType: record.invoiceType || '电子发票',
      operatorName: record.createBy || userStore.userInfo?.realName || '',
      uploadTime: formatDateTime(record.createTime),
    },
  ];
  invoicePickerOpen.value = false;
  formState.value.hasEInvoice = '1';
}

function scrollToSection(section: { id: string; key: string }) {
  activeNavKey.value = section.key;
  scrollLegacySection(section.id);
}

function handleDropdownClick(item: { key: string | number }) {
  openCreateByType(item.key as ClaimTypeValue);
}

onMounted(() => {
  void fetchList();
});
</script>

<template>
  <Page class="legacy-finance-page" content-class="!overflow-hidden !px-1 !py-1" auto-content-height>
    <span class="legacy-finance-accessory">流程状态</span>
    <div class="legacy-finance-shell">
      <div class="legacy-finance-tabs">
        <button
          v-for="tab in listTabs"
          :key="tab.key"
          type="button"
          class="legacy-finance-tab"
          :class="{ 'is-active': activeListTab === tab.key }"
          @click="activeListTab = tab.key"
        >
          {{ tab.label }}
        </button>
      </div>

      <div class="legacy-finance-search">
        <div class="legacy-finance-search-fields">
          <Select
            v-model:value="searchParams.claimType"
            allow-clear
            placeholder="请选择填报类型"
            class="legacy-finance-search-input legacy-finance-search-input--wide"
          >
            <Select.Option v-for="item in searchClaimTypeOptions" :key="item" :value="item">
              {{ item }}
            </Select.Option>
          </Select>
          <DatePicker.RangePicker
            v-model:value="searchParams.claimDateRange"
            value-format="YYYY-MM-DD"
            class="legacy-finance-search-input legacy-finance-search-input--wide"
          />
          <Input v-model:value="searchParams.indicatorKeyword" placeholder="请输入预算项目+子项目" class="legacy-finance-search-input legacy-finance-search-input--wide" />
          <Input v-model:value="searchParams.fundUsage" placeholder="请输入事项内容" class="legacy-finance-search-input legacy-finance-search-input--wide" />
          <Input v-model:value="searchParams.amountKeyword" placeholder="请输入申请金额" class="legacy-finance-search-input" />
        </div>
        <div class="legacy-finance-search-actions">
          <Button type="primary" class="legacy-finance-button" @click="fetchList(1)">搜索</Button>
          <Button class="legacy-finance-button" @click="resetSearch">重置</Button>
        </div>
      </div>

      <div class="legacy-finance-toolbar">
        <div class="legacy-finance-toolbar-actions">
          <Dropdown>
            <Button type="primary" class="legacy-finance-button">新增</Button>
            <template #overlay>
              <Menu @click="handleDropdownClick">
                <Menu.Item v-for="item in dropdownClaimTypeOptions" :key="item">{{ item }}</Menu.Item>
              </Menu>
            </template>
          </Dropdown>
          <Button class="legacy-finance-button" @click="submitSelectedRecord">送审</Button>
          <Button class="legacy-finance-button" @click="selectedRecord ? openRecord(selectedRecord) : message.warning('请选择一条报账申请数据')">修改</Button>
          <Popconfirm title="确定删除选中数据吗？" @confirm="deleteSelectedRecord">
            <Button class="legacy-finance-button" danger>删除</Button>
          </Popconfirm>
          <Button class="legacy-finance-button" @click="selectedRecord ? openRecord(selectedRecord, true) : message.warning('请选择一条报账申请数据')">详情</Button>
          <Button class="legacy-finance-button" @click="openHistory()">审核历史</Button>
          <Button class="legacy-finance-button" @click="copySelectedRecord">复制单据</Button>
          <Button class="legacy-finance-button" @click="templatePickerOpen = true">添加模板</Button>
          <Button class="legacy-finance-button" @click="templateManagerOpen = true">模板管理</Button>
          <Button class="legacy-finance-button" @click="showPlaceholderMessage('打印')">打印</Button>
          <Button class="legacy-finance-button" @click="showPlaceholderMessage('签名打印')">签名打印</Button>
        </div>
      </div>

      <div class="legacy-finance-summary">
        <span>申请金额(元) 小计:</span>
        <strong>{{ formatMoney(displayedAmount) }}</strong>
      </div>

      <div class="legacy-finance-panel">
        <section class="legacy-finance-table-panel">
          <Table
            class="legacy-finance-table"
            row-key="id"
            bordered
            size="middle"
            :columns="listColumns"
            :data-source="displayedRows"
            :loading="loading"
            :pagination="pagination"
            :row-selection="rowSelection"
            :locale="financeTableLocale"
            :scroll="{ x: 1700 }"
            @change="(pag) => fetchList(pag.current)"
          >
            <template #bodyCell="{ column, record }">
              <template v-if="column.key === 'status'">
                <Tag :color="resolveStatus(record).color">{{ resolveStatus(record).text }}</Tag>
              </template>
              <template v-if="column.key === 'claimAmount'">{{ formatMoney(record.claimAmount) }}</template>
              <template v-if="column.key === 'fillDate'">{{ formatDate(record.fillDate || record.claimDate) }}</template>
              <template v-if="column.key === 'progress'">{{ resolveProgress(record) }}</template>
            </template>
          </Table>
          <div class="legacy-finance-footer">
            <span>共{{ displayedRows.length }}条数据</span>
          </div>
        </section>
      </div>
    </div>

    <Teleport to="body">
      <div v-if="isFormVisible" class="legacy-finance-form-overlay">
        <div class="legacy-finance-form-dialog">
          <div class="legacy-finance-form-topbar">
            <div class="w-16"></div>
            <h2 class="legacy-finance-form-title">{{ currentClaimConfig.title }}</h2>
            <Button class="legacy-finance-form-close" type="text" @click="isFormVisible = false"><CloseOutlined /></Button>
          </div>
          <div class="legacy-finance-form-layout">
            <aside class="legacy-finance-form-aside">
              <button
                v-for="section in currentClaimConfig.navSections"
                :key="section.key"
                type="button"
                class="legacy-finance-form-nav"
                :class="{ 'is-active': activeNavKey === section.key }"
                @click="scrollToSection(section)"
              >
                <span class="legacy-finance-form-nav__icon"><component :is="navIconMap[section.icon]" /></span>
                <span>{{ section.label }}</span>
              </button>
            </aside>
            <div class="legacy-finance-form-main">
              <Form ref="formRef" :model="formState" :colon="false" layout="horizontal" class="legacy-finance-form legacy-finance-form-body">
                <section id="finance-basic-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">基本信息</span>
                  </div>
                  <div class="legacy-finance-form-grid">
                    <div
                      v-for="field in currentClaimConfig.basicFields"
                      :key="field.key"
                      :class="{ 'legacy-finance-span-2': field.span === 2, 'legacy-finance-span-3': field.span === 3 }"
                    >
                      <Form.Item :label="field.label" :name="field.key">
                        <Input v-if="field.component === 'input'" v-model:value="formState[field.key]" :placeholder="field.placeholder" :readonly="field.readonly" :disabled="isDetailMode" />
                        <Input.TextArea v-else-if="field.component === 'textarea'" v-model:value="formState[field.key]" :placeholder="field.placeholder" :rows="3" :disabled="isDetailMode" />
                        <InputNumber v-else-if="field.component === 'number'" v-model:value="formState[field.key]" :controls="false" :min="0" :placeholder="field.placeholder" :disabled="isDetailMode" />
                        <LegacyPickerInput v-else-if="field.component === 'picker'" v-model:value="formState[field.key]" :placeholder="field.placeholder" :readonly="true" @trigger="showPlaceholderMessage(`选择${field.label}`)" />
                        <Select v-else-if="field.component === 'select'" v-model:value="formState[field.key]" :placeholder="field.placeholder" :disabled="isDetailMode">
                          <Select.Option v-for="option in field.options || []" :key="option.value" :value="option.value">{{ option.label }}</Select.Option>
                        </Select>
                        <DatePicker v-else-if="field.component === 'date'" v-model:value="formState[field.key]" value-format="YYYY-MM-DD" :disabled="isDetailMode" />
                        <DatePicker.RangePicker v-else-if="field.component === 'date-range'" v-model:value="formState[field.key]" value-format="YYYY-MM-DD" :disabled="isDetailMode" />
                        <Radio.Group v-else-if="field.component === 'radio'" v-model:value="formState[field.key]" :disabled="isDetailMode">
                          <Radio v-for="option in field.options || []" :key="option.value" :value="option.value">{{ option.label }}</Radio>
                        </Radio.Group>
                      </Form.Item>
                    </div>
                  </div>
                </section>

                <section v-if="currentClaimConfig.showTraining" id="finance-training-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">培训信息</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="trainingRows.push(emptyTrainingRow())">新增行</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ trainingTableRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="trainingColumns" :data-source="trainingRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1640 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="trainingRows.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'startDate' || column.key === 'endDate'">
                        <DatePicker v-model:value="trainingRows[index][getColumnField(column)]" value-format="YYYY-MM-DD" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else-if="column.key === 'title'">
                        <Select v-model:value="trainingRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode">
                          <Select.Option v-for="option in titleOptions" :key="option.value" :value="option.value">{{ option.label }}</Select.Option>
                        </Select>
                      </template>
                      <template v-else>
                        <InputNumber v-model:value="trainingRows[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section v-if="currentClaimConfig.showMeeting" id="finance-meeting-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">会议明细</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="meetingRows.push(emptyMeetingRow())">新增行</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ meetingTableRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="meetingColumns" :data-source="meetingRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1600 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="meetingRows.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'startDate' || column.key === 'endDate'">
                        <DatePicker v-model:value="meetingRows[index][getColumnField(column)]" value-format="YYYY-MM-DD" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else-if="column.key === 'title'">
                        <Select v-model:value="meetingRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode">
                          <Select.Option v-for="option in titleOptions" :key="option.value" :value="option.value">{{ option.label }}</Select.Option>
                        </Select>
                      </template>
                      <template v-else>
                        <InputNumber v-model:value="meetingRows[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section v-if="currentClaimConfig.showTravel" id="finance-travel-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">差旅信息</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="travelRows.push(emptyTravelRow())">新增行</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ travelTableRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="travelColumns" :data-source="travelRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1760 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="travelRows.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'startDate' || column.key === 'endDate'">
                        <DatePicker v-model:value="travelRows[index][getColumnField(column)]" value-format="YYYY-MM-DD" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else-if="column.key === 'title'">
                        <Select v-model:value="travelRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode">
                          <Select.Option v-for="option in titleOptions" :key="option.value" :value="option.value">{{ option.label }}</Select.Option>
                        </Select>
                      </template>
                      <template v-else-if="column.key === 'fromPlace' || column.key === 'toPlace'">
                        <Input v-model:value="travelRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else>
                        <InputNumber v-model:value="travelRows[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section id="finance-indicator-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">经费指标</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="formState.details.push(emptyIndicatorRow())">新增</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ indicatorRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="currentClaimConfig.indicatorColumns" :data-source="formState.details" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1500 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="formState.details.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'applyAmount'">
                        <InputNumber v-model:value="formState.details[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else-if="column.key === 'remainAmount'">
                        <InputNumber :value="formState.details[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" disabled />
                      </template>
                      <template v-else>
                        <Input v-model:value="formState.details[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section id="finance-payee-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">{{ currentClaimConfig.payeeLabel }}</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="payeeRows.push(emptyPayeeRow())">新增</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ payeeTableRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="payeeColumns" :data-source="payeeRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1760 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="payeeRows.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'cardDate'">
                        <DatePicker v-model:value="payeeRows[index][getColumnField(column)]" value-format="YYYY-MM-DD" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else-if="column.key === 'accountType'">
                        <Select v-model:value="payeeRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode">
                          <Select.Option v-for="option in accountTypeOptions" :key="option.value" :value="option.value">{{ option.label }}</Select.Option>
                        </Select>
                      </template>
                      <template v-else-if="['payAmount', 'cardAmount'].includes(`${column.key || ''}`)">
                        <InputNumber v-model:value="payeeRows[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else>
                        <Input v-model:value="payeeRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section v-if="currentClaimConfig.showRelatedBills" id="finance-related-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">关联报销单</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="relatedBillRows.push(emptyRelatedBillRow())">新增</Button>
                  </div>
                  <div class="legacy-finance-section-status">数据量：<strong>{{ relatedBillTableRows.length }}</strong></div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="relatedBillColumns" :data-source="relatedBillRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 980 }">
                    <template #bodyCell="{ column, index }">
                      <template v-if="column.key === 'seq'">{{ index + 1 }}</template>
                      <template v-else-if="column.key === 'action'">
                        <Button type="link" size="small" :disabled="isDetailMode" @click="relatedBillRows.splice(index, 1)">删除</Button>
                      </template>
                      <template v-else-if="column.key === 'amount'">
                        <InputNumber v-model:value="relatedBillRows[index][getColumnField(column)]" :controls="false" :min="0" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                      <template v-else>
                        <Input v-model:value="relatedBillRows[index][getColumnField(column)]" class="legacy-finance-table-field" :disabled="isDetailMode" />
                      </template>
                    </template>
                  </Table>
                </section>

                <section id="finance-attachment-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">附件</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="showPlaceholderMessage('上传附件')">上传</Button>
                  </div>
                  <div class="legacy-finance-hint-bar">{{ currentClaimConfig.attachmentHint }}</div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="attachmentColumns" :data-source="attachmentTableRows" :pagination="false" :locale="financeTableLocale">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'actionLabel'">
                        <Button type="link" size="small" @click="showPlaceholderMessage('查看附件')">{{ record.actionLabel }}</Button>
                      </template>
                    </template>
                  </Table>
                </section>

                <section id="finance-invoice-section" class="legacy-finance-form-section">
                  <div class="legacy-finance-form-section-heading">
                    <span class="legacy-finance-form-section-title">电子发票</span>
                    <Button type="primary" class="legacy-finance-button" :disabled="isDetailMode" @click="openInvoicePicker">上传</Button>
                  </div>
                  <div class="legacy-finance-hint-bar">{{ currentClaimConfig.eInvoiceHint }}</div>
                  <Table class="legacy-finance-embedded-table" bordered size="small" :columns="eInvoiceColumns" :data-source="invoiceTableRows" :pagination="false" :locale="financeTableLocale" :scroll="{ x: 1320 }">
                    <template #bodyCell="{ column, record }">
                      <template v-if="column.key === 'amount'">{{ formatMoney(record.amount) }}</template>
                      <template v-if="column.key === 'actionLabel'">
                        <Button type="link" size="small" @click="showPlaceholderMessage('查看电子发票')">{{ record.actionLabel }}</Button>
                      </template>
                    </template>
                  </Table>
                </section>
              </Form>
              <div class="legacy-finance-form-footer">
                <Button type="primary" class="legacy-finance-button" :loading="submitting" @click="persistForm(true)">保存</Button>
                <Button class="legacy-finance-button" @click="isFormVisible = false">返回</Button>
                <Button class="legacy-finance-button" :loading="submitting" @click="persistForm(false)">暂存</Button>
                <Button class="legacy-finance-button" @click="templatePickerOpen = true">选择模板</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>

    <Modal v-model:open="templatePickerOpen" title="选择模板" width="920px" class="legacy-finance-subdialog" destroy-on-close @ok="templatePickerOpen = false">
      <div class="legacy-finance-subdialog-body">
        <Table class="legacy-finance-embedded-table" bordered size="small" :columns="templateColumns" :data-source="templateDataSource" :pagination="false" :locale="financeTableLocale" row-key="id" />
      </div>
    </Modal>

    <Modal v-model:open="templateManagerOpen" title="模板管理" width="980px" class="legacy-finance-subdialog" destroy-on-close :footer="null">
      <div class="legacy-finance-subdialog-body">
        <div class="legacy-finance-toolbar-actions mb-3">
          <Button type="primary" class="legacy-finance-button" @click="showPlaceholderMessage('新增模板')">新增</Button>
          <Button class="legacy-finance-button" @click="showPlaceholderMessage('删除模板')">删除</Button>
        </div>
        <Table class="legacy-finance-embedded-table" bordered size="small" :columns="templateColumns" :data-source="templateDataSource" :pagination="false" :locale="financeTableLocale" row-key="id" />
      </div>
    </Modal>

    <Modal v-model:open="historyOpen" :title="currentHistoryTitle" width="980px" class="legacy-finance-subdialog" destroy-on-close :footer="null">
      <div class="legacy-finance-subdialog-body">
        <Table class="legacy-finance-embedded-table" bordered size="small" :columns="historyColumns" :data-source="historyDataSource" :loading="historyLoading" :pagination="false" :locale="financeTableLocale" row-key="id" />
      </div>
    </Modal>

    <Modal v-model:open="invoicePickerOpen" title="发票夹" width="980px" class="legacy-finance-subdialog" destroy-on-close :footer="null">
      <div class="legacy-finance-subdialog-body">
        <Table class="legacy-finance-embedded-table" bordered size="small" :columns="invoiceColumns" :data-source="invoiceDataSource" :loading="invoicePickerLoading" :pagination="false" :locale="financeTableLocale" row-key="id">
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'amount'">{{ formatMoney(record.amount) }}</template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="applyInvoice(record)">选择</Button>
            </template>
          </template>
        </Table>
      </div>
    </Modal>
  </Page>
</template>
