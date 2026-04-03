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

import { contractReceiptApi } from '#/api/core/sys-manage';

const userStore = useUserStore();

const loading = ref(false);
const dataSource = ref<any[]>([]);
const pagination = ref({ current: 1, pageSize: 10, total: 0 });
const contextInfo = ref({
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  tenantName: userStore.userInfo?.tenantName || '',
});
const searchParams = ref({
  contractName: '',
  fiscalYear: userStore.userInfo?.fiscalYear || '',
  flowStatus: undefined as string | undefined,
  receiptNo: '',
  status: undefined as string | undefined,
});

const pageDescription = computed(() => {
  const parts: string[] = [];
  if (contextInfo.value.tenantName)
    parts.push(`当前账套：${contextInfo.value.tenantName}`);
  if (contextInfo.value.fiscalYear)
    parts.push(`默认年度：${contextInfo.value.fiscalYear}年度`);
  return parts.join(' · ') || '合同收款业务示例，已接入年度上下文过滤。';
});

const columns = [
  { title: '收款单号', dataIndex: 'receiptNo', key: 'receiptNo', width: 140 },
  {
    title: '合同名称',
    dataIndex: 'contractName',
    key: 'contractName',
    width: 180,
  },
  { title: '合同编号', dataIndex: 'contractNo', key: 'contractNo', width: 140 },
  { title: '流程节点', dataIndex: 'flowNode', key: 'flowNode', width: 130 },
  {
    title: '收款单位',
    dataIndex: 'receiptUnit',
    key: 'receiptUnit',
    width: 160,
  },
  {
    title: '收款日期',
    dataIndex: 'receiptDate',
    key: 'receiptDate',
    width: 140,
  },
  {
    title: '收款金额',
    dataIndex: 'receiptAmount',
    key: 'receiptAmount',
    width: 120,
  },
  { title: '流程状态', dataIndex: 'flowStatus', key: 'flowStatus', width: 100 },
  { title: '状态', dataIndex: 'status', key: 'status', width: 90 },
  { title: '创建时间', dataIndex: 'createTime', key: 'createTime', width: 170 },
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

const isModalVisible = ref(false);
const submitting = ref(false);
const formRef = ref();
const historyOpen = ref(false);
const historyLoading = ref(false);
const historyDataSource = ref<any[]>([]);
const currentHistoryTitle = ref('');

const defaultForm = () => ({
  contractName: '',
  contractNo: '',
  flowNode: '',
  flowStatus: '0',
  receiptAmount: 0,
  receiptDate: `${userStore.userInfo?.fiscalYear || new Date().getFullYear()}-01-01`,
  receiptNo: '',
  receiptUnit: '',
  status: '0',
  remark: '',
});

const formState = ref<any>(defaultForm());

const formatDate = (value?: string) =>
  value ? new Date(value).toLocaleString('zh-CN') : '-';

const formatMoney = (value?: number | string) =>
  value === undefined || value === null || value === ''
    ? '0.00'
    : Number(value).toFixed(2);

const fetchList = async (page = 1) => {
  try {
    loading.value = true;
    const res = await contractReceiptApi.getList({
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
    ? await contractReceiptApi.getById(record.id)
    : defaultForm();
  formState.value = {
    ...detail,
    receiptDate: detail?.receiptDate
      ? new Date(detail.receiptDate).toISOString().slice(0, 10)
      : defaultForm().receiptDate,
  };
  isModalVisible.value = true;
};

const handleSubmit = async () => {
  try {
    await formRef.value?.validate();
    submitting.value = true;
    if (formState.value.id) {
      await contractReceiptApi.update(formState.value.id, formState.value);
      message.success('更新合同收款成功');
    } else {
      await contractReceiptApi.create(formState.value);
      message.success('新增合同收款成功');
    }
    isModalVisible.value = false;
    fetchList(1);
  } finally {
    submitting.value = false;
  }
};

const handleDelete = async (id: string) => {
  await contractReceiptApi.remove(id);
  message.success('删除合同收款成功');
  fetchList(1);
};

const handleSubmitFlow = async (record: any) => {
  await contractReceiptApi.submit(record.id);
  message.success('合同收款送审成功');
  fetchList(pagination.value.current);
};

const handleWithdrawFlow = async (record: any) => {
  await contractReceiptApi.withdraw(record.id);
  message.success('合同收款撤回成功');
  fetchList(pagination.value.current);
};

const openHistory = async (record: any) => {
  try {
    historyLoading.value = true;
    historyOpen.value = true;
    currentHistoryTitle.value = `审核历史 - ${record.receiptNo || ''}`;
    const history = await contractReceiptApi.getHistory(record.id);
    historyDataSource.value = Array.isArray(history) ? history : [];
  } finally {
    historyLoading.value = false;
  }
};

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
            v-model:value="searchParams.receiptNo"
            placeholder="收款单号"
            style="width: 180px"
          />
          <Input
            v-model:value="searchParams.contractName"
            placeholder="合同名称"
            style="width: 180px"
          />
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
                searchParams.receiptNo = '';
                searchParams.contractName = '';
                searchParams.flowStatus = undefined;
                searchParams.status = undefined;
                fetchList(1);
              }
            "
          >
            重置
          </Button>
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
          :scroll="{ x: 1600 }"
          @change="(pag) => fetchList(pag.current)"
        >
          <template #bodyCell="{ column, record }">
            <template v-if="column.key === 'receiptAmount'">
              {{ formatMoney(record.receiptAmount) }}
            </template>
            <template
              v-if="column.key === 'receiptDate' || column.key === 'createTime'"
            >
              {{ formatDate(record[column.key]) }}
            </template>
            <template v-if="column.key === 'flowStatus'">
              <Tag
                :color="record.flowStatus === '1' ? 'processing' : 'default'"
              >
                {{ record.flowStatus === '1' ? '已提交' : '未提交' }}
              </Tag>
            </template>
            <template v-if="column.key === 'status'">
              <Tag :color="record.status === '0' ? 'success' : 'error'">
                {{ record.status === '0' ? '正常' : '停用' }}
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
      :title="formState.id ? '编辑合同收款' : '新增合同收款'"
      @ok="handleSubmit"
      :confirm-loading="submitting"
      destroy-on-close
      width="760px"
    >
      <Form ref="formRef" :model="formState" layout="vertical" class="mt-4">
        <div class="grid grid-cols-2 gap-4">
          <Form.Item label="收款单号" name="receiptNo">
            <Input
              v-model:value="formState.receiptNo"
              placeholder="请输入收款单号"
            />
          </Form.Item>
          <Form.Item
            label="合同名称"
            name="contractName"
            :rules="[{ required: true, message: '请输入合同名称' }]"
          >
            <Input
              v-model:value="formState.contractName"
              placeholder="请输入合同名称"
            />
          </Form.Item>
          <Form.Item label="合同编号" name="contractNo">
            <Input
              v-model:value="formState.contractNo"
              placeholder="请输入合同编号"
            />
          </Form.Item>
          <Form.Item label="流程节点" name="flowNode">
            <Input
              v-model:value="formState.flowNode"
              placeholder="当前流程节点"
              disabled
            />
          </Form.Item>
          <Form.Item label="收款单位" name="receiptUnit">
            <Input
              v-model:value="formState.receiptUnit"
              placeholder="请输入收款单位"
            />
          </Form.Item>
          <Form.Item
            label="收款日期"
            name="receiptDate"
            :rules="[{ required: true, message: '请输入收款日期' }]"
          >
            <Input
              v-model:value="formState.receiptDate"
              placeholder="YYYY-MM-DD"
            />
          </Form.Item>
          <Form.Item label="收款金额" name="receiptAmount">
            <InputNumber
              v-model:value="formState.receiptAmount"
              :min="0"
              style="width: 100%"
            />
          </Form.Item>
          <Form.Item label="流程状态" name="flowStatus">
            <Radio.Group v-model:value="formState.flowStatus" disabled>
              <Radio value="0">未提交</Radio>
              <Radio value="1">已提交</Radio>
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
            {{ formatDate(record.approvalTime) }}
          </template>
        </template>
      </Table>
    </Modal>
  </Page>
</template>
