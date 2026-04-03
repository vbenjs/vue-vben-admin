<script setup lang="ts">
import { onMounted, ref } from 'vue';

import { Page } from '@vben/common-ui';

import {
  Button,
  Card,
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

import { authAdjustApplyApi } from '#/api/core/sys-manage';
import { useCrudTable } from '#/composables/useCrudTable';

const defaultFormState = {
  applyNo: '',
  applyDeptName: '',
  indicatorName: '',
  indicatorAmount: 0,
  applyAmount: 0,
  preciseAmount: 0,
  fundUsage: '',
  operatorName: '',
  flowStatus: '0',
  status: '0',
  remark: '',
};

const {
  loading,
  dataSource,
  pagination,
  isModalVisible,
  submitting,
  formRef,
  formState,
  fetchList,
  openModal,
  handleSubmit,
  handleDelete,
  onTableChange,
} = useCrudTable({
  api: authAdjustApplyApi,
  rowKey: 'id',
  defaultFormState,
  messages: {
    createSuccess: '新增申请成功',
    updateSuccess: '更新申请成功',
    deleteSuccess: '删除申请成功',
  },
});
void formRef;

const searchParams = ref({
  indicatorName: '',
  applyDeptName: '',
  flowStatus: undefined as string | undefined,
});
const historyColumns = [
  { title: '动作', dataIndex: 'approvalAction', key: 'approvalAction', width: 100 },
  { title: '审批人', dataIndex: 'approverName', key: 'approverName', width: 120 },
  {
    title: '审批部门',
    dataIndex: 'approverDeptName',
    key: 'approverDeptName',
    width: 150,
  },
  { title: '意见', dataIndex: 'approvalOpinion', key: 'approvalOpinion' },
  { title: '时间', dataIndex: 'approvalTime', key: 'approvalTime', width: 180 },
];
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');
const formatAmount = (v: number | string) =>
  Number(v || 0).toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const flowStatusMap: Record<string, { color: string; text: string }> = {
  '0': { color: 'default', text: '草稿' },
  '1': { color: 'processing', text: '审核中' },
  '2': { color: 'success', text: '已通过' },
  '3': { color: 'error', text: '已驳回' },
};

const columns = [
  { title: '申请单号', dataIndex: 'applyNo', key: 'applyNo', width: 160 },
  { title: '申请部门', dataIndex: 'applyDeptName', key: 'applyDeptName', width: 140 },
  { title: '指标名称', dataIndex: 'indicatorName', key: 'indicatorName', width: 200 },
  { title: '指标金额', dataIndex: 'indicatorAmount', key: 'indicatorAmount', width: 120 },
  { title: '申请金额', dataIndex: 'applyAmount', key: 'applyAmount', width: 120 },
  { title: '资金用途', dataIndex: 'fundUsage', key: 'fundUsage', width: 220 },
  { title: '审批状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 100 },
  { title: '操作人', dataIndex: 'operatorName', key: 'operatorName', width: 100 },
  { title: '操作', key: 'action', width: 240 },
];

const doFetch = () => fetchList(1, searchParams.value);
const resetFilters = () => {
  searchParams.value.indicatorName = '';
  searchParams.value.applyDeptName = '';
  searchParams.value.flowStatus = undefined;
  doFetch();
};
const openHistory = async (record: any) => {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.applyNo || ''}`;
    const history = await authAdjustApplyApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
};
const handleSubmitFlow = async (record: any) => {
  await authAdjustApplyApi.submit(record.id);
  message.success('授权调整申请送审成功');
  await fetchList(pagination.value.current, searchParams.value);
};
const handleWithdrawFlow = async (record: any) => {
  await authAdjustApplyApi.withdraw(record.id);
  message.success('授权调整申请撤回成功');
  await fetchList(pagination.value.current, searchParams.value);
};

onMounted(() => doFetch());
</script>

<template>
  <Page>
    <div class="p-4">
      <Card :bordered="false">
        <div class="mb-4 flex flex-wrap gap-3">
          <Input
            v-model:value="searchParams.indicatorName"
            placeholder="指标名称"
            class="w-48"
            allow-clear
          />
          <Input
            v-model:value="searchParams.applyDeptName"
            placeholder="申请部门"
            class="w-36"
            allow-clear
          />
          <Select
            v-model:value="searchParams.flowStatus"
            placeholder="审批状态"
            class="w-32"
            allow-clear
          >
            <Select.Option value="0">草稿</Select.Option>
            <Select.Option value="1">审核中</Select.Option>
            <Select.Option value="2">已通过</Select.Option>
            <Select.Option value="3">已驳回</Select.Option>
          </Select>
          <Button type="primary" @click="doFetch">查询</Button>
          <Button @click="resetFilters">重置</Button>
          <Button type="primary" class="ml-auto" @click="openModal()">
            + 新增
          </Button>
        </div>
        <Table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :pagination="pagination"
          @change="onTableChange"
          row-key="id"
          bordered
          size="middle"
          :scroll="{ x: 1400 }"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'indicatorAmount'">
              {{ formatAmount(record.indicatorAmount) }}
            </template>
            <template v-if="column.key === 'applyAmount'">
              {{ formatAmount(record.applyAmount) }}
            </template>
            <template v-if="column.key === 'flowStatus'">
              <Tag :color="flowStatusMap[record.flowStatus]?.color || 'default'">
                {{ flowStatusMap[record.flowStatus]?.text || '未知' }}
              </Tag>
            </template>
            <template v-if="column.key === 'action'">
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
              <Popconfirm title="确定删除吗？" @confirm="handleDelete(record.id)">
                <Button type="link" danger size="small">删除</Button>
              </Popconfirm>
            </template>
          </template>
        </Table>
      </Card>
      <Modal
        v-model:open="isModalVisible"
        :title="formState.id ? '编辑申请' : '新增申请'"
        @ok="handleSubmit()"
        :confirm-loading="submitting"
        destroy-on-close
        width="760px"
      >
        <Form
          ref="formRef"
          :model="formState"
          :label-col="{ span: 5 }"
          :wrapper-col="{ span: 17 }"
          class="mt-4"
        >
          <div class="grid grid-cols-2 gap-x-4">
            <Form.Item label="申请单号" name="applyNo">
              <Input
                v-model:value="formState.applyNo"
                placeholder="可为空，保存后自动生成"
              />
            </Form.Item>
            <Form.Item label="申请部门" name="applyDeptName">
              <Input v-model:value="formState.applyDeptName" />
            </Form.Item>
            <Form.Item
              label="指标名称"
              name="indicatorName"
              :rules="[{ required: true, message: '请输入指标名称' }]"
            >
              <Input v-model:value="formState.indicatorName" />
            </Form.Item>
            <Form.Item label="指标金额" name="indicatorAmount">
              <InputNumber
                v-model:value="formState.indicatorAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item
              label="申请金额"
              name="applyAmount"
              :rules="[{ required: true, message: '请输入申请金额' }]"
            >
              <InputNumber
                v-model:value="formState.applyAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="精确金额" name="preciseAmount">
              <InputNumber
                v-model:value="formState.preciseAmount"
                class="w-full"
                :min="0"
              />
            </Form.Item>
            <Form.Item label="资金用途" name="fundUsage">
              <Input v-model:value="formState.fundUsage" />
            </Form.Item>
            <Form.Item label="操作人" name="operatorName">
              <Input v-model:value="formState.operatorName" />
            </Form.Item>
          </div>
          <Form.Item label="备注" name="remark">
            <Input.TextArea v-model:value="formState.remark" :rows="3" />
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
              {{ formatDate(record.approvalTime) }}
            </template>
          </template>
        </Table>
      </Modal>
    </div>
  </Page>
</template>
