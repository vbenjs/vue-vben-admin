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

import { procurementApplyApi } from '#/api/core/sys-manage';

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
  flowStatus: undefined as string | undefined,
  procureType: '',
  projectName: '',
  status: undefined as string | undefined,
});

const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');

const defaultFormState = () => ({
  applyDate: userStore.userInfo?.fiscalYear
    ? `${userStore.userInfo.fiscalYear}-01-01`
    : '',
  applyNo: '',
  bizNode: '',
  flowStatus: '0',
  operatorName: '',
  procureAmount: 0,
  procureMethod: '',
  procureType: '',
  projectName: '',
  remark: '',
  status: '0',
  unitName: '',
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
  { title: '归口单位', dataIndex: 'unitName', key: 'unitName', width: 180 },
  {
    title: '采购类型',
    dataIndex: 'procureType',
    key: 'procureType',
    width: 140,
  },
  {
    title: '采购方式',
    dataIndex: 'procureMethod',
    key: 'procureMethod',
    width: 140,
  },
  { title: '流程节点', dataIndex: 'bizNode', key: 'bizNode', width: 130 },
  {
    title: '申报金额',
    dataIndex: 'procureAmount',
    key: 'procureAmount',
    width: 140,
  },
  { title: '申报日期', dataIndex: 'applyDate', key: 'applyDate', width: 140 },
  {
    title: '经办人',
    dataIndex: 'operatorName',
    key: 'operatorName',
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
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleDateString('zh-CN') : '-';
const formatDateTime = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';
const normalizeDate = (value?: string) =>
  value ? String(value).slice(0, 10) : '';

async function fetchList(page = pagination.value.current) {
  loading.value = true;
  try {
    const result = await procurementApplyApi.getList({
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
    flowStatus: undefined,
    procureType: '',
    projectName: '',
    status: undefined,
  };
  fetchList(1);
}

function openModal(record?: any) {
  formState.value = record
    ? {
        ...defaultFormState(),
        ...record,
        applyDate: normalizeDate(record.applyDate),
      }
    : defaultFormState();
  isModalVisible.value = true;
}

async function handleSubmit() {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await procurementApplyApi.update(formState.value.id, formState.value);
      message.success('更新采购申报成功');
    } else {
      await procurementApplyApi.create(formState.value);
      message.success('新增采购申报成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
}

async function handleDelete(id: string) {
  await procurementApplyApi.remove(id);
  message.success('删除采购申报成功');
  fetchList(1);
}

async function handleSubmitFlow(record: any) {
  await procurementApplyApi.submit(record.id);
  message.success('采购申报送审成功');
  await fetchList(pagination.value.current);
}

async function handleWithdrawFlow(record: any) {
  await procurementApplyApi.withdraw(record.id);
  message.success('采购申报撤回成功');
  await fetchList(pagination.value.current);
}

async function openHistory(record: any) {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.applyNo || record.projectName || ''}`;
    const history = await procurementApplyApi.getHistory(record.id);
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
          <Input
            v-model:value="searchParams.procureType"
            placeholder="采购类型"
            style="width: 160px"
          />
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
          :scroll="{ x: 1820 }"
          @change="(pag) => fetchList(pag.current || 1)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'procureAmount'">
              {{ formatMoney(record.procureAmount) }}
            </template>
            <template v-else-if="column.key === 'applyDate'">
              {{ formatDate(record.applyDate) }}
            </template>
            <template v-else-if="column.key === 'createTime'">
              {{ formatDateTime(record.createTime) }}
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
      :title="formState.id ? '编辑采购申报' : '新增采购申报'"
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
          <Form.Item label="归口单位" name="unitName">
            <Input
              v-model:value="formState.unitName"
              placeholder="请输入归口单位"
            />
          </Form.Item>
          <Form.Item label="流程节点" name="bizNode">
            <Input
              v-model:value="formState.bizNode"
              placeholder="当前流程节点"
              disabled
            />
          </Form.Item>
          <Form.Item label="经办人" name="operatorName">
            <Input
              v-model:value="formState.operatorName"
              placeholder="请输入经办人"
            />
          </Form.Item>
          <Form.Item label="采购类型" name="procureType">
            <Input
              v-model:value="formState.procureType"
              placeholder="请输入采购类型"
            />
          </Form.Item>
          <Form.Item label="采购方式" name="procureMethod">
            <Input
              v-model:value="formState.procureMethod"
              placeholder="请输入采购方式"
            />
          </Form.Item>
          <Form.Item label="申报金额" name="procureAmount">
            <InputNumber
              v-model:value="formState.procureAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item
            label="申报日期"
            name="applyDate"
            :rules="[{ required: true, message: '请输入申报日期' }]"
          >
            <Input
              v-model:value="formState.applyDate"
              placeholder="YYYY-MM-DD"
            />
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
