<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';
import { useUserStore } from '@vben/stores';

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  message,
  Modal,
  Popconfirm,
  Radio,
  Select,
  Table,
  Tabs,
  Tag,
} from 'ant-design-vue';

import { invoiceFolderApi } from '#/api/core/finance';
import { expenseClaimApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  applicant: '',
  claimNo: '',
  claimType: undefined as string | undefined,
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  flowStatus: undefined as string | undefined,
  status: undefined as string | undefined,
});
const pageDescription = computed(() => {
  const parts: string[] = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '报账申请主入口，支持高频模板录入与送审。';
});

const claimTypeOptions = [
  '一般性费用报销单',
  '批量支付报销单',
  '差旅费报销单',
];

const columns = [
  { title: '报销单号', dataIndex: 'claimNo', key: 'claimNo', width: 150 },
  { title: '报销类型', dataIndex: 'claimType', key: 'claimType', width: 160 },
  { title: '申请人', dataIndex: 'applicant', key: 'applicant', width: 120 },
  { title: '填报部门', dataIndex: 'deptName', key: 'deptName', width: 160 },
  { title: '资金用途', dataIndex: 'fundUsage', key: 'fundUsage', width: 220 },
  { title: '流程节点', dataIndex: 'flowNode', key: 'flowNode', width: 130 },
  { title: '报销日期', dataIndex: 'claimDate', key: 'claimDate', width: 140 },
  {
    title: '报销金额',
    dataIndex: 'claimAmount',
    key: 'claimAmount',
    width: 120,
  },
  {
    title: '应付金额',
    dataIndex: 'payableAmount',
    key: 'payableAmount',
    width: 120,
  },
  { title: '流程状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '明细数', dataIndex: 'detailCount', key: 'detailCount', width: 90 },
  { title: '操作', key: 'action', width: 280 },
];

const historyColumns: any[] = [
  {
    title: '动作',
    dataIndex: 'approvalAction',
    key: 'approvalAction',
    width: 100,
  },
  {
    title: '审批人',
    dataIndex: 'approverName',
    key: 'approverName',
    width: 120,
  },
  {
    title: '审批部门',
    dataIndex: 'approverDeptName',
    key: 'approverDeptName',
    width: 150,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];

const detailColumns = [
  { title: '用途', dataIndex: 'usage', key: 'usage', width: 180 },
  { title: '指标名称', dataIndex: 'indicatorName', key: 'indicatorName', width: 180 },
  { title: '经济分类', dataIndex: 'econCategory', key: 'econCategory', width: 160 },
  { title: '剩余额度', dataIndex: 'remainAmount', key: 'remainAmount', width: 120 },
  { title: '申请金额', dataIndex: 'applyAmount', key: 'applyAmount', width: 120 },
  { title: '小计', dataIndex: 'subtotal', key: 'subtotal', width: 120 },
  { title: '操作', key: 'action', width: 120 },
];
const invoiceColumns = [
  { title: '发票号码', dataIndex: 'invoiceNo', key: 'invoiceNo', width: 180 },
  { title: '文件名称', dataIndex: 'fileName', key: 'fileName', width: 220 },
  { title: '发票类型', dataIndex: 'invoiceType', key: 'invoiceType', width: 180 },
  { title: '金额', dataIndex: 'amount', key: 'amount', width: 120 },
  { title: '操作', key: 'action', width: 120 },
];

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const activeTab = ref('basic');
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');
const invoicePickerOpen = ref(false);
const invoicePickerLoading = ref(false);
const invoiceDataSource = ref<any[]>([]);

const createEmptyDetail = () => ({
  usage: '',
  indicatorName: '',
  econCategory: '',
  remainAmount: 0,
  applyAmount: 0,
  subtotal: 0,
  travelFrom: '',
  travelTo: '',
  travelDays: 0,
  travelPersons: 1,
  airFare: 0,
  accommodation: 0,
  cityTransport: 0,
  mealAllowance: 0,
  localTransport: 0,
  otherExpense: 0,
  status: '0',
  remark: '',
});

const defaultForm = () => ({
  applicant: '',
  attachPages: 0,
  claimAmount: 0,
  claimDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  claimNo: '',
  claimType: '一般性费用报销单',
  companionCount: 0,
  contractInfo: '',
  deptName: '',
  details: [createEmptyDetail()],
  fillDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  fillerName: '',
  flowStatus: '0',
  fundUsage: '',
  hasEInvoice: '0',
  indicatorInfo: '',
  invoiceNo: '',
  isContract: '0',
  loanTotal: 0,
  offsetAmount: 0,
  payableAmount: 0,
  receptionCount: 0,
  receptionDays: 0,
  receptionPlace: '',
  receptionStandard: 0,
  receptionTarget: '',
  refundAmount: 0,
  remark: '',
  standardLimit: 0,
  standardType: '',
  status: '0',
  travelDays: 0,
  travelEndDate: '',
  travelReason: '',
  travelStartDate: '',
});

const formState = ref<any>(defaultForm());

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);

const syncClaimAmount = () => {
  const total = (formState.value.details || []).reduce(
    (sum: number, item: any) => sum + Number(item.subtotal || item.applyAmount || 0),
    0,
  );
  formState.value.claimAmount = total;
  if (!Number(formState.value.payableAmount || 0)) {
    formState.value.payableAmount = total;
  }
};

const refreshDetailSubtotal = (record: any) => {
  if (formState.value.claimType === '差旅费报销单') {
    record.subtotal =
      Number(record.airFare || 0) +
      Number(record.accommodation || 0) +
      Number(record.cityTransport || 0) +
      Number(record.mealAllowance || 0) +
      Number(record.localTransport || 0) +
      Number(record.otherExpense || 0);
    record.applyAmount = record.subtotal;
  } else {
    record.subtotal = Number(record.subtotal || record.applyAmount || 0);
    record.applyAmount = Number(record.applyAmount || record.subtotal || 0);
  }
  syncClaimAmount();
};

const addDetail = () => {
  formState.value.details = [...(formState.value.details || []), createEmptyDetail()];
};

const removeDetail = (index: number) => {
  const details = [...(formState.value.details || [])];
  details.splice(index, 1);
  formState.value.details = details.length > 0 ? details : [createEmptyDetail()];
  syncClaimAmount();
};

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await expenseClaimApi.getList({
      page,
      pageSize: pagination.value.pageSize,
      ...searchParams.value,
    });
    dataSource.value = res?.items || [];
    pagination.value.current = page;
    pagination.value.total = res?.total || 0;
    contextInfo.value = {
      fiscalYear:
        res?.context?.fiscalYear || userStore.userInfo?.fiscalYear || '',
      tenantName:
        res?.context?.tenantName || userStore.userInfo?.tenantName || '',
    };
  } finally {
    loading.value = false;
  }
};

const openModal = async (record?: any) => {
  const detail = record?.id
    ? await expenseClaimApi.getById(record.id)
    : defaultForm();
  formState.value = {
    ...defaultForm(),
    ...detail,
    claimDate: detail?.claimDate
      ? new Date(detail.claimDate).toISOString().slice(0, 10)
      : defaultForm().claimDate,
    fillDate: detail?.fillDate
      ? new Date(detail.fillDate).toISOString().slice(0, 10)
      : defaultForm().fillDate,
    travelStartDate: detail?.travelStartDate
      ? new Date(detail.travelStartDate).toISOString().slice(0, 10)
      : '',
    travelEndDate: detail?.travelEndDate
      ? new Date(detail.travelEndDate).toISOString().slice(0, 10)
      : '',
    details:
      Array.isArray(detail?.details) && detail.details.length > 0
        ? detail.details.map((item: any) => ({ ...createEmptyDetail(), ...item }))
        : [createEmptyDetail()],
  };
  activeTab.value = 'basic';
  isModalVisible.value = true;
  syncClaimAmount();
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    syncClaimAmount();
    const payload = {
      ...formState.value,
      details: (formState.value.details || []).map((item: any) => ({
        ...item,
        subtotal: Number(item.subtotal || item.applyAmount || 0),
        applyAmount: Number(item.applyAmount || item.subtotal || 0),
      })),
    };
    if (formState.value.id) {
      await expenseClaimApi.update(formState.value.id, payload);
      message.success('更新报账申请成功');
    } else {
      await expenseClaimApi.create(payload);
      message.success('新增报账申请成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await expenseClaimApi.remove(id);
  message.success('删除报账申请成功');
  fetchList(1);
};

const handleSubmitFlow = async (record: any) => {
  await expenseClaimApi.submit(record.id);
  message.success('报账申请送审成功');
  fetchList(pagination.value.current);
};

const handleWithdrawFlow = async (record: any) => {
  await expenseClaimApi.withdraw(record.id);
  message.success('报账申请撤回成功');
  fetchList(pagination.value.current);
};

const openHistory = async (record: any) => {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.claimNo || ''}`;
    const history = await expenseClaimApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
};
const openInvoicePicker = async () => {
  try {
    invoicePickerLoading.value = true;
    invoicePickerOpen.value = true;
    const res = await invoiceFolderApi.getList({ page: 1, pageSize: 200, useStatus: '0' });
    invoiceDataSource.value = res?.items || [];
  } finally {
    invoicePickerLoading.value = false;
  }
};
const applyInvoice = (record: any) => {
  formState.value.invoiceNo = record.invoiceNo || '';
  formState.value.hasEInvoice = '1';
  if (!Number(formState.value.claimAmount || 0) && Number(record.amount || 0) > 0) {
    formState.value.claimAmount = Number(record.amount || 0);
  }
  invoicePickerOpen.value = false;
};

onMounted(() => fetchList());
</script>

<template>
  <Page title="报账申请" :description="pageDescription">
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度，如 2026"
            style="width: 140px"
          />
          <Input
            v-model:value="searchParams.claimNo"
            placeholder="报销单号"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.applicant"
            placeholder="申请人"
            style="width: 160px"
          />
          <Select
            v-model:value="searchParams.claimType"
            placeholder="报销类型"
            allow-clear
            style="width: 180px"
          >
            <Select.Option v-for="item in claimTypeOptions" :key="item" :value="item">
              {{ item }}
            </Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.flowStatus"
            placeholder="流程状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未提交</Select.Option>
            <Select.Option value="1">已提交</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.status"
            placeholder="状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">正常</Select.Option>
            <Select.Option value="1">停用</Select.Option>
          </Select>
          <Button type="primary" @click="fetchList(1)">查询</Button>
          <Button
            @click="
              () => {
                searchParams.fiscalYear = userStore.userInfo?.fiscalYear || '';
                searchParams.claimNo = '';
                searchParams.applicant = '';
                searchParams.claimType = undefined;
                searchParams.flowStatus = undefined;
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增报账申请
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
          :scroll="{ x: 2000 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="['claimAmount', 'payableAmount'].includes(String(column.key))">
              {{ formatMoney(record[String(column.key)]) }}
            </template>
            <template v-if="column.key === 'claimDate' || column.key === 'createTime'">
              {{ formatDate(record[column.key]) }}
            </template>
            <template v-if="column.key === 'flowStatus'">
              <Tag :color="record.flowStatus === '1' ? 'processing' : 'default'">
                {{ record.flowStatus === '1' ? '已提交' : '未提交' }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">编辑</Button>
              <Button
                v-if="record.flowStatus !== '1'"
                type="link"
                size="small"
                @click="handleSubmitFlow(record)"
              >
                送审
              </Button>
              <Button
                v-if="record.flowStatus === '1'"
                type="link"
                size="small"
                @click="handleWithdrawFlow(record)"
              >
                撤回
              </Button>
              <Button type="link" size="small" @click="openHistory(record)">历史</Button>
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>

    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑报账申请' : '新增报账申请'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="1200px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <Tabs v-model:activeKey="activeTab">
          <Tabs.TabPane key="basic" tab="基本信息">
            <div class="grid grid-cols-3 gap-4">
              <Form.Item label="报销单号" name="claimNo">
                <Input
                  v-model:value="formState.claimNo"
                  placeholder="可为空，保存后自动生成"
                />
              </Form.Item>
              <Form.Item
                label="报销类型"
                name="claimType"
                :rules="[{ required: true, message: '请选择报销类型' }]"
              >
                <Select v-model:value="formState.claimType" placeholder="请选择报销类型">
                  <Select.Option v-for="item in claimTypeOptions" :key="item" :value="item">
                    {{ item }}
                  </Select.Option>
                </Select>
              </Form.Item>
              <Form.Item
                label="申请人"
                name="applicant"
                :rules="[{ required: true, message: '请输入申请人' }]"
              >
                <Input v-model:value="formState.applicant" placeholder="请输入申请人" />
              </Form.Item>
              <Form.Item label="填报人" name="fillerName">
                <Input v-model:value="formState.fillerName" placeholder="请输入填报人" />
              </Form.Item>
              <Form.Item label="填报部门" name="deptName">
                <Input v-model:value="formState.deptName" placeholder="请输入填报部门" />
              </Form.Item>
              <Form.Item label="报销日期" name="claimDate">
                <Input v-model:value="formState.claimDate" placeholder="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item label="填报日期" name="fillDate">
                <Input v-model:value="formState.fillDate" placeholder="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item label="资金用途" name="fundUsage">
                <Input v-model:value="formState.fundUsage" placeholder="请输入资金用途" />
              </Form.Item>
              <Form.Item label="指标信息" name="indicatorInfo">
                <Input v-model:value="formState.indicatorInfo" placeholder="请输入指标信息" />
              </Form.Item>
              <Form.Item label="报销金额" name="claimAmount">
                <InputNumber v-model:value="formState.claimAmount" class="w-full" :min="0" />
              </Form.Item>
              <Form.Item label="应付金额" name="payableAmount">
                <InputNumber
                  v-model:value="formState.payableAmount"
                  class="w-full"
                  :min="0"
                />
              </Form.Item>
              <Form.Item label="单据张数" name="attachPages">
                <InputNumber v-model:value="formState.attachPages" class="w-full" :min="0" />
              </Form.Item>
              <Form.Item label="借款金额" name="loanTotal">
                <InputNumber v-model:value="formState.loanTotal" class="w-full" :min="0" />
              </Form.Item>
              <Form.Item label="冲账金额" name="offsetAmount">
                <InputNumber v-model:value="formState.offsetAmount" class="w-full" :min="0" />
              </Form.Item>
              <Form.Item label="退款金额" name="refundAmount">
                <InputNumber v-model:value="formState.refundAmount" class="w-full" :min="0" />
              </Form.Item>
              <Form.Item label="电子发票" name="hasEInvoice">
                <Radio.Group v-model:value="formState.hasEInvoice">
                  <Radio value="1">有</Radio>
                  <Radio value="0">无</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="发票号码" name="invoiceNo">
                <Input v-model:value="formState.invoiceNo" placeholder="请输入发票号码">
                  <template #addonAfter>
                    <Button type="link" size="small" @click="openInvoicePicker">选择发票</Button>
                  </template>
                </Input>
              </Form.Item>
              <Form.Item label="合同相关" name="isContract">
                <Radio.Group v-model:value="formState.isContract">
                  <Radio value="1">是</Radio>
                  <Radio value="0">否</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="合同信息" name="contractInfo" class="col-span-2">
                <Input v-model:value="formState.contractInfo" placeholder="请输入合同信息" />
              </Form.Item>
            </div>
            <div v-if="formState.claimType === '差旅费报销单'" class="mt-2 grid grid-cols-3 gap-4">
              <Form.Item label="出差事由" name="travelReason">
                <Input v-model:value="formState.travelReason" placeholder="请输入出差事由" />
              </Form.Item>
              <Form.Item label="出差开始" name="travelStartDate">
                <Input
                  v-model:value="formState.travelStartDate"
                  placeholder="YYYY-MM-DD"
                />
              </Form.Item>
              <Form.Item label="出差结束" name="travelEndDate">
                <Input v-model:value="formState.travelEndDate" placeholder="YYYY-MM-DD" />
              </Form.Item>
              <Form.Item label="出差天数" name="travelDays">
                <InputNumber v-model:value="formState.travelDays" class="w-full" :min="0" />
              </Form.Item>
            </div>
            <Form.Item label="备注" name="remark">
              <Input.TextArea v-model:value="formState.remark" placeholder="请输入备注" :rows="3" />
            </Form.Item>
          </Tabs.TabPane>
          <Tabs.TabPane key="detail" tab="经费明细">
            <div class="mb-3 flex gap-3">
              <Button type="primary" @click="addDetail">新增明细</Button>
              <Button @click="syncClaimAmount">汇总到报销金额</Button>
            </div>
            <Table
              :columns="detailColumns"
              :data-source="formState.details"
              :pagination="false"
              row-key="id"
              bordered
              size="small"
              :scroll="{ x: 1200 }"
            >
              <template #bodyCell="{ column, record, index }">
                <template v-if="column.key === 'usage'">
                  <Input v-model:value="record.usage" placeholder="用途" />
                </template>
                <template v-if="column.key === 'indicatorName'">
                  <Input v-model:value="record.indicatorName" placeholder="指标名称" />
                </template>
                <template v-if="column.key === 'econCategory'">
                  <Input v-model:value="record.econCategory" placeholder="经济分类" />
                </template>
                <template v-if="column.key === 'remainAmount'">
                  <InputNumber
                    v-model:value="record.remainAmount"
                    class="w-full"
                    :min="0"
                    @change="refreshDetailSubtotal(record)"
                  />
                </template>
                <template v-if="column.key === 'applyAmount'">
                  <InputNumber
                    v-model:value="record.applyAmount"
                    class="w-full"
                    :min="0"
                    @change="refreshDetailSubtotal(record)"
                  />
                </template>
                <template v-if="column.key === 'subtotal'">
                  <InputNumber
                    v-model:value="record.subtotal"
                    class="w-full"
                    :min="0"
                    @change="refreshDetailSubtotal(record)"
                  />
                </template>
                <template v-if="column.key === 'action'">
                  <Button type="link" danger size="small" @click="removeDetail(index)">
                    删除
                  </Button>
                </template>
              </template>
            </Table>
            <div v-if="formState.claimType === '差旅费报销单'" class="mt-4 text-sm text-gray-500">
              差旅费模板可在明细中继续补充出发地、目的地、交通费、住宿费等字段；系统会按明细金额汇总报销金额。
            </div>
          </Tabs.TabPane>
          <Tabs.TabPane key="status" tab="流程信息">
            <div class="grid grid-cols-3 gap-4">
              <Form.Item label="流程状态" name="flowStatus">
                <Radio.Group v-model:value="formState.flowStatus" disabled>
                  <Radio value="0">未提交</Radio>
                  <Radio value="1">已提交</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="流程节点" name="flowNode">
                <Input v-model:value="formState.flowNode" disabled placeholder="送审后自动更新" />
              </Form.Item>
              <Form.Item label="状态" name="status">
                <Radio.Group v-model:value="formState.status">
                  <Radio value="0">正常</Radio>
                  <Radio value="1">停用</Radio>
                </Radio.Group>
              </Form.Item>
            </div>
          </Tabs.TabPane>
        </Tabs>
      </Form>
    </Modal>

    <Modal
      v-model:open="historyOpen"
      :title="currentHistoryTitle"
      :footer="null"
      width="980px"
      destroy-on-close
    >
      <Table
        :columns="historyColumns"
        :data-source="historyDataSource"
        :loading="historyLoading"
        row-key="id"
        bordered
        size="small"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'approvalTime'">
            {{ formatDate(record.approvalTime) }}
          </template>
        </template>
      </Table>
    </Modal>

    <Modal
      v-model:open="invoicePickerOpen"
      title="选择发票"
      :footer="null"
      width="900px"
      destroy-on-close
    >
      <Table
        :columns="invoiceColumns"
        :data-source="invoiceDataSource"
        :loading="invoicePickerLoading"
        row-key="id"
        bordered
        size="small"
        :pagination="false"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'amount'">
            {{ formatMoney(record.amount) }}
          </template>
          <template v-if="column.key === 'action'">
            <Button type="link" size="small" @click="applyInvoice(record)">选择</Button>
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
