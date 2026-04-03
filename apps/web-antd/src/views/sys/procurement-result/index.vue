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
  Tag,
} from 'ant-design-vue';

import { procurementResultApi } from '#/api/core/sys-manage';

const userStore = useUserStore();
const loading = ref(false);
const submitting = ref(false);
const isModalVisible = ref(false);
const dataSource = ref<any[]>([]);
const formRef = ref();
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  applyNo: '',
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  inputStatus: undefined as string | undefined,
  flowStatus: undefined as string | undefined,
  projectName: '',
  status: undefined as string | undefined,
});

const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');

const defaultFormState = () => ({
  applyNo: '',
  creditCode: '',
  flowStatus: '0',
  inputStatus: '0',
  projectName: '',
  remark: '',
  status: '0',
  winBidAmount: 0,
  winBidSupplier: '',
});
const formState = ref<any>(defaultFormState());

const pageDescription = computed(
  () =>
    `当前年度：${contextInfo.value.fiscalYear || '-'} ｜ 当前账套：${contextInfo.value.tenantName || '-'}`,
);

const columns = [
  { title: '申报单号', dataIndex: 'applyNo', key: 'applyNo', width: 180 },
  {
    title: '项目名称',
    dataIndex: 'projectName',
    key: 'projectName',
    width: 220,
  },
  {
    title: '中标金额',
    dataIndex: 'winBidAmount',
    key: 'winBidAmount',
    width: 140,
  },
  {
    title: '中标供应商',
    dataIndex: 'winBidSupplier',
    key: 'winBidSupplier',
    width: 220,
  },
  {
    title: '统一信用代码',
    dataIndex: 'creditCode',
    key: 'creditCode',
    width: 180,
  },
  {
    title: '录入状态',
    dataIndex: 'inputStatus',
    key: 'inputStatus',
    width: 120,
  },
  { title: '流程状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 120 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 100 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 180 },
  { title: '操作', key: 'action', width: 250 },
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

const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);
const formatDateTime = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

async function fetchList(page = pagination.value.current) {
  loading.value = true;
  try {
    const result = await procurementResultApi.getList({
      ...searchParams.value,
      page,
      pageSize: pagination.value.pageSize,
    });
    dataSource.value = result.items || [];
    pagination.value = {
      ...pagination.value,
      current: page,
      total: result.total || 0,
    };
    if (result.context) contextInfo.value = result.context;
  } finally {
    loading.value = false;
  }
}

function resetSearch() {
  searchParams.value = {
    applyNo: '',
    fiscalYear: userStore.userInfo?.fiscalYear || '',
    inputStatus: undefined,
    flowStatus: undefined,
    projectName: '',
    status: undefined,
  };
  fetchList(1);
}

function openModal(record?: any) {
  formState.value = record
    ? { ...defaultFormState(), ...record }
    : defaultFormState();
  isModalVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await procurementResultApi.update(formState.value.id, formState.value);
      message.success('更新采购结果成功');
    } else {
      await procurementResultApi.create(formState.value);
      message.success('新增采购结果成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await procurementResultApi.remove(id);
  message.success('删除采购结果成功');
  fetchList(1);
}

async function handleSubmitFlow(record: any) {
  await procurementResultApi.submit(record.id);
  message.success('采购结果送审成功');
  await fetchList(pagination.value.current);
}

async function handleWithdrawFlow(record: any) {
  await procurementResultApi.withdraw(record.id);
  message.success('采购结果撤回成功');
  await fetchList(pagination.value.current);
}

async function openHistory(record: any) {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.applyNo || record.projectName || ''}`;
    const history = await procurementResultApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
}

onMounted(() => fetchList());
</script>

<template>
  <Page>
    <div class="space-y-4">
      <Card>
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.fiscalYear"
            placeholder="年度，如 2026"
            style="width: 140px"
          />
          <Input
            v-model:value="searchParams.applyNo"
            placeholder="申报单号"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.projectName"
            placeholder="项目名称"
            style="width: 180px"
          />
          <Select
            v-model:value="searchParams.inputStatus"
            placeholder="录入状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">未录入</Select.Option>
            <Select.Option value="1">已录入</Select.Option>
          </Select>
          <Select
            v-model:value="searchParams.flowStatus"
            placeholder="流程状态"
            allow-clear
            style="width: 120px"
          >
            <Select.Option value="0">草稿</Select.Option>
            <Select.Option value="1">流转中</Select.Option>
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
          <Button @click="resetSearch">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
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
          :scroll="{ x: 1720 }"
          @change="(pag) => fetchList(pag.current || 1)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'winBidAmount'">
              {{ formatMoney(record.winBidAmount) }}
            </template>
            <template v-else-if="column.key === 'createTime'">
              {{ formatDateTime(record.createTime) }}
            </template>
            <template v-else-if="column.key === 'inputStatus'">
              <Tag :color="record.inputStatus === '1' ? 'success' : 'default'">
                {{ record.inputStatus === '1' ? '已录入' : '未录入' }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'flowStatus'">
              <Tag
                :color="record.flowStatus === '1' ? 'processing' : 'default'"
              >
                {{ record.flowStatus === '1' ? '流转中' : '草稿' }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
              </Tag>
            </template>
            <template v-else-if="column.key === 'action'">
              <Button type="link" size="small" @click="openModal(record)">
                编辑
              </Button>
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
              <Button type="link" size="small" @click="openHistory(record)">
                历史
              </Button>
              <Popconfirm
                title="确定删除吗？"
                @confirm="handleDelete(record.id)"
              >
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
    </div>
    <Modal
      v-model:open="isModalVisible"
      :title="formState.id ? '编辑采购结果' : '新增采购结果'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="820px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item
            label="申报单号"
            name="applyNo"
            :rules="[{ required: true, message: '请输入申报单号' }]"
          >
            <Input
              v-model:value="formState.applyNo"
              placeholder="请输入申报单号"
            />
          </Form.Item>
          <Form.Item
            label="项目名称"
            name="projectName"
            :rules="[{ required: true, message: '请输入项目名称' }]"
          >
            <Input
              v-model:value="formState.projectName"
              placeholder="请输入项目名称"
            />
          </Form.Item>
          <Form.Item label="中标金额" name="winBidAmount">
            <InputNumber
              v-model:value="formState.winBidAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="中标供应商" name="winBidSupplier">
            <Input
              v-model:value="formState.winBidSupplier"
              placeholder="请输入中标供应商"
            />
          </Form.Item>
          <Form.Item label="统一信用代码" name="creditCode">
            <Input
              v-model:value="formState.creditCode"
              placeholder="请输入统一信用代码"
            />
          </Form.Item>
          <Form.Item label="录入状态" name="inputStatus">
            <Radio.Group v-model:value="formState.inputStatus">
              <Radio value="0">未录入</Radio>
              <Radio value="1">已录入</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="流程状态" name="flowStatus">
            <Radio.Group v-model:value="formState.flowStatus" disabled>
              <Radio value="0">草稿</Radio>
              <Radio value="1">流转中</Radio>
            </Radio.Group>
          </Form.Item>
          <Form.Item label="状态" name="status">
            <Radio.Group v-model:value="formState.status">
              <Radio value="0">正常</Radio>
              <Radio value="1">停用</Radio>
            </Radio.Group>
          </Form.Item>
        </div>
        <Form.Item label="备注" name="remark">
          <Input.TextArea
            v-model:value="formState.remark"
            placeholder="可输入备注信息"
          />
        </Form.Item>
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
            {{ formatDateTime(record.approvalTime) }}
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
